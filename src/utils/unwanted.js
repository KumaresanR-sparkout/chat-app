const isStatus = await Message.aggregate(
    [
        {
            $match: {
                seen_by: false,
            }
        },
        
        {
            $lookup: {
                from: "chats",
                localField: "chat_ref",
                foreignField: "_id",
                as: "result",
            },
        },
        {
            $unwind: "$result"
        },
        
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $addFields: {
                sorted_users: {
                    $sortArray: {
                        input: '$result.users', sortBy: 1
                    }
                }
            }
        },

        {
            $group: {
                _id: "$sorted_users",
                chat_name:{$first:"$result.chat_name"},
                lastmessage: { $first: '$content' },
                unread: { $sum: 1 }
            }
        },
        {
            $project: {
                unread_count: "$unread",
                lastmessage: 1,
                chat_name:1

            },
        }
    ]
)

const isfilter = isStatus.filter((sender => {
    const id = sender._id.toString()
    if (id.includes('66471e3b9fa50773ae8b1647')) {
        return sender
    }
}))

const groupStatus = await GroupMessage.aggregate([
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $match: {
            seen_by: false,
            group_id: new mongoose.Types.ObjectId(req.query.groupId)
        }
    },

    {
        $lookup: {
            from: "groups",
            localField: "group_id",
            foreignField: "_id",
            as: "result",
        }

    },


])
