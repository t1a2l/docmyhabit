// tools.js
// ========
module.exports = {
    createType: function (modelName, propertyName, typeName) {
        const varabileName = new modelName({
            [propertyName]: typeName
        });

        modelName.findOne({ [propertyName]: typeName }, function (err, res) {
        if(!res) {
            varabileName.save();
        }
        });
  }
};



