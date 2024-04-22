import MessageHistory from '../model/MessageHistory.js'

class MessageHistoryService {
	async addMessage(usernames, message) {
		try {
			const messageHistory = await MessageHistory.findOne({ usernames: usernames })
			if (messageHistory) {
				const updatedMessageHistory = await MessageHistory.findOneAndUpdate(
					{ usernames: usernames },
					{
						$push: { messages: message },
					},
					{ new: true }
				)
				return updatedMessageHistory
			}

			const addedMessageHistory = await MessageHistory.create({
				usernames: usernames,
				messages: [message],
			})

			return addedMessageHistory
		} catch (error) {
			console.error('Error handling message history:', error)
			throw error
		}
	}

	async getMessageHistory(usernames) {
		try {
			const messageHistory = await MessageHistory.findOne({ usernames: usernames })
			return messageHistory ? messageHistory.messages : []
		} catch (error) {
			console.error('Error fetching message history:', error)
			throw error
		}
	}
}

export default new MessageHistoryService()
