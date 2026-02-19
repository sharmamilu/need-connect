export const mockComments = [
  {
    id: "c1",
    user: {
      name: "Aman Verma",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    text: "Interested! Please share more details.",
    createdAt: "30m ago",
    likes: 5,
    replies: [
      {
        id: "r1",
        user: {
          name: "Rahul Sharma",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        text: "Sure, I’ll DM you.",
        createdAt: "10m ago",
        likes: 2,
        replies: [
          {
            id: "r1_1",
            user: {
              name: "Aman Verma",
              avatar: "https://i.pravatar.cc/150?img=12",
            },
            text: "Thanks! Waiting.",
            createdAt: "5m ago",
            likes: 1,
          },
        ],
      },
    ],
  },
];
