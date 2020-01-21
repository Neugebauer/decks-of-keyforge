package coraythan.keyswap.users

import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class KeyUserService(
        private val userRepo: KeyUserRepo,
        private val currentUserService: CurrentUserService,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder,
        private val passwordResetCodeService: PasswordResetCodeService,
        private val deckListingRepo: DeckListingRepo,
        private val deckRepo: DeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val usernameRegex = "(\\d|\\w|-|_)+".toRegex()

    fun register(userRegInfo: UserRegistration): KeyUser {

        check(userRegInfo.password.length > 7) {
            "Password is too short."
        }
        validateEmail(userRegInfo.email)
        check(userRegInfo.username.isNotBlank()) {
            "Username is blank."
        }

        check(userRegInfo.username.matches(usernameRegex)) {
            "Username is malformed: ${userRegInfo.username}"
        }

        check(userRepo.findByUsernameIgnoreCase(userRegInfo.username) == null) {
            log.info("${userRegInfo.username} username is already taken.")
            "This username is already taken."
        }

        return userRepo.save(KeyUser(
                id = UUID.randomUUID(),
                username = userRegInfo.username,
                email = userRegInfo.email,
                password = bCryptPasswordEncoder.encode(userRegInfo.password),
                type = UserType.USER,
                publicContactInfo = if (userRegInfo.publicContactInfo.isNullOrBlank()) null else userRegInfo.publicContactInfo,
                allowUsersToSeeDeckOwnership = userRegInfo.allowUsersToSeeDeckOwnership,
                lastVersionSeen = userRegInfo.lastVersionSeen,
                currencySymbol = "$",
                country = userRegInfo.country
        ))
    }

    fun userFromEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun findByIdOrNull(id: UUID) = userRepo.findByIdOrNull(id)
    fun findUserProfile(username: String) =
            userRepo.findByUsernameIgnoreCase(username)?.toProfile(currentUserService.loggedInUser()?.username == username)

    fun findUserByUsername(username: String) = userRepo.findByUsernameIgnoreCase(username)

    fun findByEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun updateUserProfile(update: UserProfileUpdate) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val userAllowsTrades = user.allowsTrades
        var auctions = user.auctions

        if (update.currencySymbol != user.currencySymbol && deckListingRepo.findAllBySellerIdAndStatus(user.id, DeckListingStatus.ACTIVE).isNotEmpty()) {
            throw BadRequestException("You cannot update your currency symbol while you have active auctions.")
        }

        if (update.country != user.country || update.currencySymbol != user.currencySymbol) {
            auctions = user.auctions.map {
                it.copy(forSaleInCountry = update.country ?: Country.UnitedStates, currencySymbol = update.currencySymbol)
            }
        }

        if (update.email != null) validateEmail(update.email)

        userRepo.save(user.copy(
                email = update.email ?: user.email,
                emailVerified = if (update.email == null) user.emailVerified else false,
                publicContactInfo = update.publicContactInfo,
                allowsTrades = update.allowsTrades,
                allowUsersToSeeDeckOwnership = update.allowUsersToSeeDeckOwnership,
                currencySymbol = update.currencySymbol,
                country = update.country,
                preferredCountries = if (update.preferredCountries.isNullOrEmpty()) null else update.preferredCountries,
                decks = user.decks,
                auctions = auctions,
                sellerEmail = update.sellerEmail,
                discord = update.discord,
                storeName = update.storeName,
                displayCrucibleTrackerWins = update.displayCrucibleTrackerWins
        ))

       if (userAllowsTrades != update.allowsTrades) {
            val activeListings = deckListingRepo.findAllBySellerIdAndStatus(user.id, DeckListingStatus.BUY_IT_NOW_ONLY)
            activeListings.forEach {
                deckListingRepo.save(it.copy(forTrade = update.allowsTrades))
                deckRepo.save(it.deck.copy(forTrade = update.allowsTrades))
            }
        }
    }

    fun resetPasswordTo(code: String, newPassword: String) {

        check(newPassword.length > 7) {
            "Password is too short."
        }

        val emailToResetFor = passwordResetCodeService.resetCodeEmail(code) ?: throw IllegalArgumentException("No email for this code or expired.")
        val userAccount = userRepo.findByEmailIgnoreCase(emailToResetFor) ?: throw IllegalStateException("No account found with email $emailToResetFor")
        val withPassword = userAccount.copy(password = bCryptPasswordEncoder.encode(newPassword))
        userRepo.save(withPassword)
        passwordResetCodeService.delete(code)
    }

    fun updateLatestUserVersion(version: String) {
        val user = currentUserService.loggedInUser()
        if (user != null) {
            userRepo.save(user.copy(lastVersionSeen = version))
        }
    }

    fun setContributionLevel(username: String, patreonRewardsTier: PatreonRewardsTier) {
        val toUpdate = userRepo.findByUsernameIgnoreCase(username) ?: throw BadRequestException("No user for user name $username")
        userRepo.save(toUpdate.copy(patreonTier = patreonRewardsTier))
    }

    fun verifyEmail(code: String) {
        val email = passwordResetCodeService.emailForVerification(code) ?: throw BadRequestException("No email for verification code $code")
        val user = userRepo.findByEmailIgnoreCase(email) ?: throw BadRequestException("No user for email $email")
        userRepo.save(user.copy(emailVerified = true))
    }

    private fun validateEmail(email: String) {
        check(email.isNotBlank()) {
            "Email is blank."
        }
        check(userRepo.findByEmailIgnoreCase(email) == null) {
            log.info("$email email is already taken.")
            "This email is already taken."
        }
    }
}
