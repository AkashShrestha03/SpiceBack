const pagination = async(model, query , page =1, limit = 10) => {
    const skip = (page - 1) * 10;
    const results= await model.find(query).skip(skip).limit(limit);
    const total=await model.countDocuments(query);
    const totalPages=Math.ceil(total/limit);
    return {results,total,totalPages};
}
 
module.exports=pagination;