/**
 * Simple and safe parser for the FUNGI programming language (single-line version).
 * Parses FUNGI code into a structured object and executes it in a controlled environment.
 */

export class FungiParser {
    constructor() {
        this.variables = {}; // Store variables for execution
        this.programEnd = "FUNGIEND";
        this.programStart = "FUNGISTART";
    }

    /**
     * Tokenize the input code into individual commands.
     * @param {string} code - The FUNGI code as a single-line string.
     * @returns {Array} Array of tokens.
     */
    tokenize(code) {
        // cut out valid code section (between start and end of program)
        let startIndex = code.indexOf(this.programStart);
        let endIndex = code.indexOf(this.programEnd);
        const validCode = code.substring(startIndex + this.programStart.length, endIndex);

        return validCode.split(';').map(command => command.trim()).filter(command => command !== "");
    }

    /**
     * Parse tokens into structured commands.
     * @param {Array} tokens - Tokenized FUNGI code.
     * @returns {Array} Parsed commands.
     */
    parse(tokens) {
        const commands = [];

        tokens.forEach((line, lineNumber) => {
            const parts = line.split(/\s+/);
            const command = parts[0].toUpperCase(); // Get the first part as the command

            // Handle the ONREPLY command
            if (command === "ONREPLY") {
                const replyMessage = parts[1].replace(/"/g, ''); // Remove quotes from the message
                const respondMessage = parts.slice(3).join(" "); // Remove quotes from the message after DO RESPOND
                commands.push({ command, replyMessage, respondMessage });
            } else {
                throw new Error(`Unknown command '${command}'`);
            }
        });

        return commands;
    }

    /**
     * Execute the parsed commands.
     * @param {Array} commands - Parsed FUNGI commands.
     * @param {string} input - The input that should be processed.
     */
    execute(commands, input) {
        let temp = input;
        commands.forEach(command => {
            temp = this.executeCommand(command, temp);
        });
        return temp;
    }

    /**
     * Execute a single command.
     * @param {Object} command - Single command object.
     * @param {string} input - the message that should be replied to.
     */
    executeCommand(command, input) {
        if (command.command === "ONREPLY" && input && input.includes(command.replyMessage)) {
            return command.respondMessage;
        } else {
            return "Invalid input. Mention should contain: '" + command.replyMessage + "'";
        }
    }

    containsValidFUNGI(content) {
        if (!content.includes(this.programStart) && !content.includes(this.programEnd)) {
            return false;
        }

        try {
            const tokens = this.tokenize(content);
            this.parse(tokens);
            return true;
        } catch (error) {
            return false;
        }
    }
}
