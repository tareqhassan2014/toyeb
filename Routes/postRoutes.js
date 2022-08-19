const express = require('express');
const {
    postsList,
    addPost,
    deletePost,
    getPostById,
    updatePost,
    deleteLike,
    deleteComment,
    deleteShare,
    deleteFile,
    updatePostLike,
    updatePostComments,
    updatePostShares,
} = require('../controllers/postController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/list', AuthenticatorJWT, postsList);
router.get('/get/:id', AuthenticatorJWT, getPostById);
router.post('/add', upload.array('files', 5), addPost);
router.patch('/update/:id', updatePost);
router.post('/update/:id/likes', updatePostLike);
router.patch('/update/:id/comments', updatePostComments);
router.patch('/update/:id/shares', updatePostShares);
router.delete('/delete/:id', AuthenticatorJWT, deletePost);
router.delete('/delete/like/:post/:like', AuthenticatorJWT, deleteLike);
router.delete(
    '/delete/comment/:post/:comment',
    AuthenticatorJWT,
    deleteComment
);
router.delete('/delete/share/:post/:share', AuthenticatorJWT, deleteShare);
router.delete('/delete/file/:post/:file', AuthenticatorJWT, deleteFile);

module.exports = router;
