const Company = require("../models/companies");

const getCompany = (key, value) => {
    let query = {};
    if (key == "user_id") {
        query = { user_id: value }
    } else {
        query = { _id: value }
    }
    return new Promise((resolve, reject) => {
        Company.findOne(query)
            .populate("user_id", "-password")
            .populate("category_id")
            .then(doc => {
                if (doc == null) throw new Error("Company not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getCompanyDetails = (id) => {
    return new Promise((resolve, reject) => {
        Company.findById(id)
            .populate("user_id", "-password")
            .populate("category_id")
            .then(doc => {
                if (doc == null) throw new Error("Company not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getAllCompany = (filter) => {
    let query = {};
    if (filter.city) {
        query['city'] = filter.city;
    }
    if (filter.country) {
        query['country'] = filter.country;
    }

    // if (filter.search) {
    //     query["name"] = { '$regex' : filter.search, '$options' : 'i' };
    // }
    let pageIndex = filter.page ? Number(filter.page) - 1 : 0;
    let perPage = filter.limit ? Number(filter.limit) : 1000;
    let sortBy = filter.sort ? filter.sort : "createdAt";
    let sortType = filter.typeOfSort ? (filter.typeOfSort == "inc" ? 1 : -1) : -1;
    console.log("search company", query);
    return new Promise((resolve, reject) => {
        Company.find(query)
            .sort([[sortBy, sortType]])
            .skip(pageIndex * perPage)
            .limit(perPage)
            .populate("user_id", "-password")
            .then(doc => {
                if (doc == null) throw new Error("Companies not found");
                console.log("result", doc)
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getCompany,
    getAllCompany,
    getCompanyDetails,
}