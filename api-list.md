app.post "/api/login"
app.post "/api/signup"
app.get "/logout"
app.get "/api/user_data"

// The following are from Zane:
//
// get /api/queries
//     get all previous queries
// get /api/queries/:id
//     get specific query
// delete /api/queries
//     clear history
// delete /api/queries/:id
//     delete specific query
// post /api/queries
//     create new query and return result
//