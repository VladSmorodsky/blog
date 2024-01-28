exports.getPosts = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: [
            {
                id: 1,
                title: 'Post 1',
                content: "Hello from post",
                createdAt: Date.now()
            }
        ]
    });
}

exports.createPost = (req, res, next) => {
    res.status(201).json({
        status: 'success'
    });
}

exports.getPost = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            id: 1,
            title: 'Post 1',
            content: "Hello from post",
            createdAt: Date.now()
        }
    });
}

exports.editPost = (req, res, next) => {
    res.status(200).json({
        status: 'success'
    });
}

exports.deletePost = (req, res, next) => {
    res.status(204).json();
}