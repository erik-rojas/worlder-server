const CODE = {
    GET_OK: 200,
    CREATE_OK: 201,
    DELETE_OK: 204,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
}

CATEGORY = {
    1: "Web Design",
    2: "SEO",
    3: "Google Adwords",
    4: "Facebook Advertsing",
    5: "Mobile App Develop",
    6: "Software Outsoursing",
    7: "Digital Marketing"
}

module.exports = {
    CODE,
    CATEGORY
};