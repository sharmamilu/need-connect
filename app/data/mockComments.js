export const mockComments = [
  {
    id: "c1",
    user: {
      name: "Rahul S.",
      avatar: "https://i.pravatar.cc/150?img=11",
      title: "Senior React Developer",
      isVerified: true,
      rating: 5,
    },
    text: "What stack was used for this project? The app looks really smooth!",
    createdAt: "2d ago",
    likes: 12,
    category: "React Native",
    replies: [
      {
        id: "r1",
        user: {
          name: "Sumit P.",
          avatar: "https://i.pravatar.cc/150?img=12",
          title: "React Developer",
          isVerified: true,
          rating: 4.5,
        },
        text: "Nicely done! Can you share some of the API integrations you used?",
        createdAt: "3d ago",
        likes: 5,
        category: "React Native",
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    user: {
      name: "Milan Sharma",
      avatar: "https://i.pravatar.cc/150?img=13",
      title: "Milan Sharma",
      isVerified: false,
      rating: 5,
    },
    text: "Impressive work! How long did it take to complete this app?",
    createdAt: "1w ago",
    likes: 2,
    category: "React Native",
    replies: [],
  },
];
