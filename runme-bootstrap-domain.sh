#rm -rf api/domain-api-poster
builder api create domain-api-poster 4002

cd api/domain-api-poster

# ------------------------------------------------------------------------------------------------
# User
# ------------------------------------------------------------------------------------------------

builder api domain add-aggregate        User

# RegisterUser
builder api domain add-create-command   User    registerUser
# ---
builder api domain add-index-rule       User    registerUser     userMustNotAlreadyExist
builder api domain add-command-rule     User    registerUser     passwordMustBeStrong
# ---
builder api domain add-event            User    registerUser     userRegistered

# ChangeUserName
builder api domain add-update-command   User    changeUserName
# ---
builder api domain add-index-rule       User    changeUserName   userMustExist
# ---
builder api domain add-event            User    changeUserName   userNameChanged

# ------------------------------------------------------------------------------------------------
# Post
# ------------------------------------------------------------------------------------------------

builder api domain add-aggregate        Post

# CreatePost
builder api domain add-create-command   Post    createPost
# ---
builder api domain add-index-rule       Post    createPost      postMustNotAlreadyExist
builder api domain add-index-rule       Post    createPost      userMustExist
builder api domain add-command-rule     Post    createPost      maximumOfTenImages
# ---
builder api domain add-event            Post    createPost      postCreated

# ChangePostText
builder api domain add-update-command   Post    changePostText
# ---
builder api domain add-index-rule       Post    changePostText     postMustExist
builder api domain add-aggregate-rule   Post    changePostText     postMustBeOwnedByUser
builder api domain add-aggregate-rule   Post    changePostText     postMustNotBeArchived
# ---
builder api domain add-event            Post    changePostText     postTitleChanged

# PublishPost
builder api domain add-update-command   Post    publishPost
# ---
builder api domain add-index-rule       Post    publishPost     postMustExist
builder api domain add-aggregate-rule   Post    publishPost     postMustBeOwnedByUser
builder api domain add-aggregate-rule   Post    publishPost     postMustBeUnpublished
# ---
builder api domain add-event            Post    publishPost     postPublished

# UnpublishPost
builder api domain add-update-command   Post    unpublishPost
# ---
builder api domain add-index-rule       Post    unpublishPost   postMustExist
builder api domain add-aggregate-rule   Post    unpublishPost   postMustBeOwnedByUser
builder api domain add-aggregate-rule   Post    unpublishPost   postMustBePublished
# ---
builder api domain add-event            Post    unpublishPost   postUnpublished

# ArchivePost
builder api domain add-update-command   Post    archivePost
# ---
builder api domain add-index-rule       Post    archivePost     postMustExist
builder api domain add-aggregate-rule   Post    archivePost     postMustBeOwnedByUser
builder api domain add-aggregate-rule   Post    archivePost     postMustNotBeArchived
# ---
builder api domain add-event            Post    archivePost     postArchived

# ------------------------------------------------------------------------------------------------
# PostLikes
# ------------------------------------------------------------------------------------------------

builder api domain add-aggregate        PostLikes

# Like Post
builder api domain add-upsert-command   PostLikes    likePost
# ---
builder api domain add-index-rule       PostLikes    likePost       userMustExist
builder api domain add-index-rule       PostLikes    likePost       postMustExist
builder api domain add-aggregate-rule   PostLikes    likePost       mustNotHaveAlreadyLikedPost
# ---
builder api domain add-event            PostLikes    likePost       postLiked

# Unlike Post
builder api domain add-upsert-command   PostLikes    unlikePost
# ---
builder api domain add-index-rule       PostLikes    unlikePost     userMustExist
builder api domain add-index-rule       PostLikes    unlikePost     postMustExist
builder api domain add-aggregate-rule   PostLikes    unlikePost     mustHaveAlreadyLikedPost
# ---
builder api domain add-event            PostLikes    unlikePost     postUnliked

# # ------------------------------------------------------------------------------------------------
# # UserPostBookmarks
# # ------------------------------------------------------------------------------------------------

builder api domain add-aggregate        UserPostBookmarks

# Save Post
builder api domain add-upsert-command   UserPostBookmarks    bookmarkPost
# ---
builder api domain add-index-rule       UserPostBookmarks    bookmarkPost      userMustExist
builder api domain add-index-rule       UserPostBookmarks    bookmarkPost      postMustExist
builder api domain add-aggregate-rule   UserPostBookmarks    bookmarkPost      mustNotHaveAlreadySavedPost
# ---
builder api domain add-event            UserPostBookmarks    bookmarkPost      postSaved

# Unsave Post
builder api domain add-upsert-command   UserPostBookmarks    unbookmarkPost
# ---
builder api domain add-index-rule       UserPostBookmarks    unbookmarkPost    userMustExist
builder api domain add-index-rule       UserPostBookmarks    unbookmarkPost    postMustExist
builder api domain add-aggregate-rule   UserPostBookmarks    unbookmarkPost    mustHaveAlreadySavedPost
# ---
builder api domain add-event            UserPostBookmarks    unbookmarkPost    postUnsaved

# ------------------------------------------------------------------------------------------------

rush update
rush build


