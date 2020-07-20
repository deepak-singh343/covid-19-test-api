//include all necessary models
const Patient = require('../../../models/patient');
const Doctor = require('../../../models/doctor');
const Report = require('../../../models/report');

//register a new patient if doesnt exist
module.exports.registerPatient = async function(req, res){
  try{
    // console.log("inside registerPatient ", req.user);
    //find the patient with given mobile number
    let patient = await Patient.findOne({mobile: req.body.mobile});
    if(patient){
      //if patient found send his details
      return res.status(200).json({
        message: "Patient details",
        patient: patient
      })
    }
    else{
      //if a patient with the given mobile number doesnt exist create one
      patient = await Patient.create({
        mobile: req.body.mobile
      });
      return res.status(200).json({
        message: "Patient registered successfully",
        patient: patient
      })
    }
  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

//create a new report
module.exports.createReport = async function(req, res){
  try{
    //check if the doctor and patient are valid
    let doctor = await Doctor.findById(req.user.id);
    let patient = await Patient.findById(req.params.id);
    // , function(err){
    //   if(err){
    //     return res.status(401).json({
    //       message: "Invalid details"
    //     });
    //   }
    // })
    if(doctor && patient){
      //randomly select a status from the given options
      let statusArray = ['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit'];
      let status = statusArray[Math.floor(Math.random() * statusArray.length)];
      //current date
      let date = new Date().toJSON().slice(0,10).toString();
      //create a new report
      let report = await Report.create({
        doctor: doctor._id,
        patient: patient._id,
        status: status,
        date: date
      });

      //save the report in patients reports array
      patient.reports.push(report.id);
      patient.save();

      return res.status(200).json({
        message: "Report created successfully",
        report: report
      });
    }else{
      return res.status(401).json({
        message: "Invalid details"
      });
    }
  }catch(err){
    return res.status(401).json({
      message: "Invalid details"
    });
  }
}

//retrieve all reports of a patient
module.exports.allReports = async function(req, res){
  try{
    let patient = await Patient.findById(req.params.id);
    // , function(err){
    //   if(err){
    //     return res.status(401).json({
    //       message: "Invalid details"
    //     });
    //   }
    // })
    //fetch the reports of the given patient
    let reports = await Patient.findById(req.params.id)
    .sort('-createdAt')
    .populate({
      path: 'reports',
      select: 'doctor status date'
    });
    //if patient found send his reports
    return res.status(200).json({
      patientMobile: reports.mobile,
      message: "All Reports of " + reports.mobile,
      reports: reports.reports
    });
  }catch(err){
    return res.status(401).json({
      message: "Invalid details"
    });
  }
}