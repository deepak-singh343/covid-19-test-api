const Report = require('../../../models/report');

//retrieve all reports that match a status
module.exports.allReportsWithStatus = async function(req, res){
  try{
    let statusArray = ['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit'];
    if(statusArray.indexOf(req.params.status) == -1){
      return res.status(401).json({
        message: "Invalid details"
      });
    }
    //find all the reports that match the given status and populate doctor and patient details
    let reports = await Report.find({status: req.params.status}, 'doctor patient status date')
      .populate({
        path: 'doctor',
        select: 'username -_id'
      })
      .populate({
        path: 'patient',
        select: 'mobile -_id'
      });
    
      //return all matching reports
    return res.status(200).json({
      message: "All reports whose status is " + req.params.status,
      reports: reports
    });
  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}