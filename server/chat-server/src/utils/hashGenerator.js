import crypto from 'crypto'
/**
 * Generates a hash from the given parameters.
 * @param {string} username - The username to include in the hash.
 * @param {Date} date - The date to include in the hash.
 * @param {number} index - The index to include in the hash.
 * @returns {string} The resulting hash.
 */
function generateHash(username, date, index) {
	const hash = crypto.createHash('sha256')
	const input = `${username}-${date.toISOString()}-${index}`

	hash.update(input)

	return hash.digest('hex')
}
