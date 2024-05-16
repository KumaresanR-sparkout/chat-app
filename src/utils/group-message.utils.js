import Groupusers from '../models/groupUser.model'

export const saveGroupMessage = async (group_id, sender_id, message) => {
    try {
        const Message = {
            "group_id": group_id,
            "sender_id": sender_id,
            "message": message
        }
        const _response = await new Groupusers(Message).save()
        console.log(_response)
        return true
    }
    catch (error) {
        return false
    }
}