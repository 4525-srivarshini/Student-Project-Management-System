const mongoose = require('mongoose');



const project = new mongoose.Schema({
    projectCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectCreatorName: {
        type: String,
        ref: 'User',
    },
    teamNo: {
        type: String,
        required: true
    },
    projectTitle: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    projectFiles: [{
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        fileSize: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        }
    }],
    members: [{
        memberRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            autopopulate: { select: 'name registrationNo userType' }
        },
        designation: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        registrationNo: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            required: true
        }
    }],



    projectPhases: [{
        PhaseTitle: {
            type: String,
            required: true
        },
        PhaseNum: {
            type: String,
            required: true
        },
        PhaseStatus: {
            type: String,
            default: "Pending",
            required: true
        },
    }],
    phasePercentage: {
        type: String,
        required: true
    },
    progressBar: {
        type: String,
        default: "0",
        required: true
    },

}, { timestamps: true })

const Project = mongoose.model('PROJECT', project);

module.exports = Project;