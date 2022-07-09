const express = require("express");
const app = express();
const db = require('./connectdb')

app.use(express.static('public'))
app.set('view engine', 'ejs')


app.get('/members', function(req,res,next){
    let totalCount;
    let totalPages;
    let dataRows = [];
    let firstLinkIndex;
    let lastLinkIndex;
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;
    const prevIndex = (page - 1) * size;
    const countQuery = "SELECT COUNT(*) AS count FROM clearance_members"
    db.query(countQuery, function (err,result){
        if(err) throw { status:500, message: "Looks like we ran into an error fetching data" + err.message, }
        totalCount = result[0].count;
        totalPages = Math.ceil(totalCount / size);
        const dataQuery = `SELECT * FROM clearance_members ORDER BY date_updated LIMIT ${size} OFFSET ${prevIndex}`
        db.query(dataQuery, function (err,result){
            if(err) throw err.message;
            dataRows = result;
            if(page > totalPages) return res.redirect('/members?page=' + encodeURIComponent(totalPages) + '&size=' + encodeURIComponent(size))
            if(page < 1 ) return res.redirect('/members?page=' + encodeURIComponent(1) + '&size=' + encodeURIComponent(size));
        
            // we want to show last 4 amd next 4 pages from the current page
            firstLinkIndex = page - 4 < 1 ? 1 : page -4
            lastLinkIndex= page + 4 > totalPages ? totalPages : page + 4;

            if(page - firstLinkIndex != 4){
                while(lastLinkIndex < totalPages){
                    if(lastLinkIndex - firstLinkIndex == 8) break;
                    lastLinkIndex++
                }
            }
            else if(page + 4 != lastLinkIndex){
                while(firstLinkIndex > 0 ){
                    if(lastLinkIndex - firstLinkIndex == 8) break;
                    firstLinkIndex++
                }
            }

            res.render('index', {message:"Data successfuly fetched", data:{dataRows,totalCount,firstLinkIndex,lastLinkIndex,size,page,totalPages}})
    
        })
    

    });



} )

app.listen(9100,()=>console.log("App started on port 9100"))