package coraythan.keyswap

enum class House {
    Brobnar,
    Dis,
    Logos,
    Mars,
    Sanctum,
    Shadows,
    Untamed,
    StarAlliance,
    SaurianRepublic;

    companion object {
        fun valueOfOrNull(value: String): House? {
            try {
                return House.valueOf(value)
            } catch (e: Exception) {
                return null
            }
        }
    }
}