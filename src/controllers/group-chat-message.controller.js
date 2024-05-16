import Groupuser from '../models/groupUser.model'
import * as response from '../utils/response.util'

export const groupChatMessage = async (req, res) => {
    try {
        const message = await Groupuser.find()
            .populate({ path: 'group_id', select: ['group_name'] })
            .then(groupMessage => groupMessage
                .filter(data => data.group_id._id == req.params.id))
        console.log(message)
        return response.sendSuccess(res, 200, "data fetched by the group based on users", message)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}