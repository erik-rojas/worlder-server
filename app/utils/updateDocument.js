var _ = require('underscore');

// doc : object
// data: key-value from req.body

const selectFieldsToUpdateOnly = (body = {}, fields = []) => {
    return Object.keys(body)
    .filter(key => fields.indexOf(key) > -1)
    .reduce((acc, cur) => {
        acc[cur] = body[cur];
        return acc;
    }, {});
}

const updateDocument = (doc, SchemaTarget, data, fieldsNotAllowed = []) => {
    for (var field in SchemaTarget.schema.paths) {
       if ((field !== '_id') && (field !== '__v') && fieldsNotAllowed.indexOf(field) === -1) {
            var newValue = getObjValue(field, data);
            if (newValue !== undefined) {
                setObjValue(field, doc, newValue);
          }  
       }  
    }
    return doc;
};

const getObjValue = (field, data) => {
    return _.reduce(field.split("."), (obj, f) => { 
        if(obj) return obj[f];
    }, data);
}

const setObjValue = (field, data, value) => {
  var fieldArr = field.split('.');
  return _.reduce(fieldArr, (o, f, i) => {
     if(i == fieldArr.length-1) {
          o[f] = value;
     } else {
          if(!o[f]) o[f] = {};
     }
     return o[f];
  }, data);
}

module.exports = {
    updateDocument
}