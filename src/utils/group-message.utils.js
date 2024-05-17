import GroupMessage from '../models/group-message.model'

export const saveGroupMessage = async (group_id, sender_id, message) => {
    try {
        const Message = {
            "group_id": group_id,
            "sender_id": sender_id,
            "message": message
        }
        const _response = await new GroupMessage(Message).save()
        console.log(_response)
        return true
    }
    catch (error) {
        return false
    }
}