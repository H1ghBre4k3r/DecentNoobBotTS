export default class $ {
    /**
     * Log a message to the normal channel.
     *
     * @param message
     *          message to log
     * @param prefix
     *          optional prefix, standard "[INFO]"
     */
    public static log(message: string, prefix: string = "[INFO]") {
        console.log(`${prefix} ${message}`);
    }

    /**
     * Send a message to stderr.
     *
     * @param message
     *          message to send
     * @param prefix
     *          optional prefix, standard "[ERROR]"
     */
    public static err(message: string, prefix: string = "[ERROR]") {
        console.error(`${prefix} ${message}`);
    }
}
