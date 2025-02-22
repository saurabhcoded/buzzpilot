const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const clog = require('./ChalkService');
const fs = require('fs');
const path = require('path');
const {default: axios} = require('axios');
const {sequelize} = require('../models');
const {getCurrentDateTime} = require('./CommonService');
const { CREATED } = require('../config/action.config');

/*  ========================
    Common Service Functions
    ======================== */

// function to replace tags in text
function TagsReplacer(data, replacements) {
    return new Promise((resolve, reject) => {
        try {
            if (data && replacements) {
                for (const [key, value] of Object.entries(replacements)) {
                    let keyValue = `{{${key}}}`;
                    const replacer = new RegExp(keyValue, "g");
                    data = data.replace(replacer, value);
                }
                resolve(data);
            } else {
                reject({message: "Parameters Not Found"})
            }
        } catch (error) {
            reject(error);
        }

    })

}

/*  =======================
    Email Service Functions
    ======================= */

// email nodemailer transporter
let MailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER, // generated SMTP user
        pass: process.env.SMTP_PASS, // generated SMTP password / Key
    },
    pool: true, // use pooled connection
    rateLimit: true, // enable to make sure we are limiting
    maxConnections: 1, // set limit to 1 connection only
    maxMessages: 3, // send 3 emails per second
});
// create readstream content for attachments url
async function getReadStreamFromURL(url) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });
        const content = Buffer.from(response.data).toString('base64');
        return {
            content,
            encoding: 'base64',
        };
    } catch (error) {
        clog.error('Error while reading attachment url', error);
        return false
    }
};
// Mail HTML Generate
function MailHtmlGenerate({product, theme, body}) {
    try {
        // Mail HTML Generate
        const ThemePath = path.join(__dirname, 'email/primary.html'); // theme path for mail html
        let MailGenerator = new Mailgen({
            theme: {
                path: ThemePath,
            },
            product,
        });
        // Generated Body
        return MailGenerator.generate({body: body});
    } catch (error) {
        clog.error('error while generating mail html body', error);
        return false;
    }
}
// Send a Single Email
async function SendEmailHandler(data) {
    try {
        // Mail Variables
        /* Required Parameters-------------
           1) subject
           2) email_to
           3) other_recipients: {
                cc
                bcc
            }
           4) email_from
           5) from_name
           6) company: {
                link
                logo
            }
           7) template:{
                intro                
           8) }
           9) attachments -> example
                [
                    {
                        "attachment": "https://y20india.in/wp-content/uploads/2023/03/03_WhitePaper_Peacebuilding_and_Reconcilliation-7.pdf",
                        "fileName": "theme.pdf",
                        "contentType": "pdf",
                        "format":"url"
                    },
                    {
                        "filename": "text1.txt",
                        "content": "hello world!"
                    }
                ]
           10) references
           11) inReplyTo
        ----------------------------------*/
        clog.warn("SendmailHandler..");
        const {to: _to, subject, other_recipients, htmlBody, attachments} = data;
        const {cc, bcc} = other_recipients;
        const companyName = process.env.COMPANY_NAME || "Ideathub";
        const companyLink = process.env.COMPANY_LINK || 'http://localhost:3000/'
        const companyLogo = process.env.COMPANY_LOGO || '';
        const companyEmail = process.env.COMPANY_EMAIL || 'no-reply@ideathub.com';

        // Adding check for Required Paramters,
        const requiredParameters = [_to, subject, htmlBody];
        if (requiredParameters.includes(undefined) || requiredParameters.includes(null)) {
            console.error('error email: required fields not provided', requiredParameters);
            return false;
        }

        // MailHtml
        const GeneratorConfig = {
            theme: 'primary',
            product: {
                name: companyName,
                link: companyLink,
                logo: companyLogo,
            },
            body: {
                intro: htmlBody,
                name: companyName,
                greeting: false,
                signature: false,
                action: null,
                outro: null
            }
        }
        // console.warn("Generating Html File...");
        const MailHtml = await MailHtmlGenerate(GeneratorConfig);

        // Mail Attachments
        clog.warn("Adding Mail Attachments..." , MailHtml);
        let MailAttachments = Array.isArray(attachments) ? attachments : [];

        MailAttachments = MailAttachments.map(async (atc) => {
            if (atc?.format == "url") {
                const stream = await getReadStreamFromURL(atc.attachment);
                return {...atc, content: stream.content}
            } else {
                return atc;
            }
        }).filter(atc => atc.content);

        // Final Mail Data
        let MailConfig = {
            from: `${companyName} <${companyEmail}>`,
            to: _to,
            cc: cc,
            bcc: bcc,
            subject: subject,
            html: MailHtml,
            attachments: MailAttachments,
            // references: references,
            // "in-reply-to": inReplyTo,
        };
        clog.info("Mail Sending... ", {...MailConfig, html: null})
        const Result = await MailTransporter.sendMail(MailConfig);
        clog.success("Email Sent", Result?.response);
        return Result;
    } catch (error) {
        console.error('error while sending email', error);
        return false
    }
}
// Function to Save an Email
async function SaveEmailService(data) {
    try {
        const {event_id, userId, email_to, cc, bcc, subject, body, attachments} = data;
        let options ={};
        const savedEmail = await sequelize.models.emails.create({
            event_id,
            userId,
            email_from: process.env.COMPANY_EMAIL || "testing@ideathub.com",
            email_to,
            other_recipient: {
                cc, bcc
            },
            subject,
            body,
            createdBy: userId,
            updatedBy: userId,
            attachments: attachments
        });
        
        // savedEmail.save();

        // action log for the email====>
        // await CommonService.actionLogs(
        //     "Email" ,
        //     savedEmail?.id ,
        //     CREATED ,
        //     options,
        //     savedEmail?.id ,
        //     req ,
        //  )
        // Processing Email after successfull save of Email
        await ProcessEmailById(savedEmail.id);
        return savedEmail;
    } catch (error) {
        clog.error('Error while Saving Email', error);
        return false
    }
}
// Process Email From Saved Email
async function ProcessEmailById(EmailId) {
    try {
        clog.info("Sending Email. ", EmailId);
        if (EmailId) {
            const EmailData = await sequelize.models.emails.findOne({
                where: {
                    id: EmailId,
                    deleted: 0
                }
            });
            if (EmailData) {
                // checking retry count
                if (+EmailData.retry_count >= 3) {
                    clog.warn("Retry Count Exceed")
                    return {status: false, message: "Retry Count Exceeded"};
                }
                // checking email sent status
                if (+EmailData.sent_status === 1) {
                    clog.warn("Email Already Sent")
                    return {status: false, message: "Email Already Sent"};
                }
                const emailConfig = {
                    from: EmailData.email_from,
                    to: EmailData.email_to,
                    subject: EmailData.subject,
                    other_recipients: EmailData.other_recipient,
                    htmlBody: EmailData.body,
                    attachments: EmailData.attachments,
                    // references: otherDetails?.references || null,
                    // inReplyTo: otherDetails?.inReplyTo || null
                }
                const EmailSendResult = await SendEmailHandler(emailConfig);
                // Mail Sent Successfully
                const EventForEmail = await sequelize.models.events.findOne({where: {id: EmailData.event_id}, });
                let currentTime = getCurrentDateTime();
                if (EmailSendResult) {
                    EmailData.sent_status = 1;
                    EmailData.sent_time = currentTime;
                    EmailData.retry_count += 1;
                    EmailData.save()
                    // updated in event the successfull status
                    EventForEmail.sent_status = 1;
                    EventForEmail.sent_time = currentTime;
                    EventForEmail.save();
                    clog.success("SENT: Updated In Event Email", EventForEmail.id);
                    return {status: true, message: "Email Sent Successfully", result: EmailSendResult};
                } else {
                    // Mail Not Sent
                    EmailData.retry_count += 1;
                    EmailData.sent_time = currentTime;
                    EmailData.save();
                    // Updating the Event for error in email send
                    EventForEmail.sent_status = 2;
                    EventForEmail.sent_time = currentTime;
                    EventForEmail.save();
                    clog.warn("NOT SENT: Updated In Event email", EventForEmail.id);
                    return {status: false, message: "Email Not Sent"};
                }
            } else {
                return {status: false, message: "Email Data Not Found"};
            }
        } else {
            return {status: false, message: "Email Id Not Found"};
        }
    } catch (error) {
        clog.error('error while processing email', error);
        return {status: false, message: "Error While Finding Email"};
    }
}
// Bulk Emails Release
async function sendQueuedEmail() {
    clog.warn("Sending the Queued Emails....");
    const emailsData = await sequelize.models.emails.findAll({
        attributes: ["id"],
        where: {
            sent_status: 0,
            deleted: 0,
        },
        order: [["id", "desc"]],
    });
    if (emailsData) {
        for (let email of emailsData) {
            await ProcessEmailById(email.id);
        }
    }
}
/*  ==============================
    Notification Service Functions
    ============================== */

// Function to Save Notification
async function SaveNotifService(data) {
    try {
        const {event_id, userId, message, other_info} = data;
        const notifiSave = await sequelize.models.notifications.create({
            event_id,
            userId,
            message,
            other_info ,
            createdBy : userId ,
        });
        notifiSave.save();
        return notifiSave;
    } catch (error) {
        clog.error('Error while Saving Notification', error);
        return false;
    }
}
// Function to Process Email By Id
function ProcessNotifById(notifId) {
    try {
        // function which will be used if any notification related process is used
        clog.success('Notification Sending.', notifId);
    } catch (error) {
        return false;
    }
}

/*  ========================
    Events Service Functions
    ======================== */

// Function to Save Event
async function SaveEventService(event_name, eventData) {
    try {
        const {userId, email_to, attachments, replacements, cc, bcc} = eventData;

        clog.success("eventName", event_name)
        clog.success("saveEventService", {event_name, userId, email_to, replacements})

        const _eventData = {email_to, cc, bcc, replacements, attachments};
        const savedEvent = await sequelize.models.events.create({
            userId,
            event_name: event_name,
            event_data: _eventData,
            createdBy : userId
        });
        await savedEvent.save();
        ProcessEventById(savedEvent.id);
    } catch (error) {
        clog.error('Error while Saving Event', error);
        return false;
    }
}
// Process Events From Saved Events
async function ProcessEventById(eventId) {
    try {
        const Event = await sequelize.models.events.findOne({where: {id: eventId, deleted: 0}})
        // check if the event processed or not
        if (+Event.sent_status === 1) {
            return {status: false, message: "Event Already Processed"};
        }
        const {email_to, cc, bcc, attachments, replacements} = Event.event_data;

        const requiredFields = [email_to, replacements];
        if (requiredFields.includes(null) || requiredFields.includes(undefined)) {
            clog.error('Please provide required details for Event Processng.');
            return "Required Fields not found";
        }
        const EventMaster = await sequelize.models.event_masters.findOne({
            where: {
                event_name: Event.event_name,
                deleted: 0
            }
        })
        // If email subject or html body not found don't send email
        if (EventMaster.subject && EventMaster.body) {
            // Save Email for this 
            // console.log('before tags replace : subject and body ' , EventMaster.subject , EventMaster.body)
            const subject = await TagsReplacer(EventMaster.subject, replacements);
            const HtmlBody = await TagsReplacer(EventMaster.body, replacements);
            // console.log('after tags replace : subject and body ' , subject , HtmlBody)
            await SaveEmailService({
                event_id: Event.id,
                userId: Event.userId,
                email_to,
                cc,
                bcc,
                subject,
                body: HtmlBody,
                attachments
            })
        }
        // If no NotificationMessage not found don't send email
        if (EventMaster.message) {
            const NotifiMessage = await TagsReplacer(EventMaster.message, replacements);
            await SaveNotifService({
                event_id: Event.id,
                userId: Event.userId,
                message: NotifiMessage
            })
        }
        // return {Event};
    } catch (error) {
        clog.error("Error while Processing Event", error);
        return false;
    }
}

module.exports = {
    sendQueuedEmail,
    SaveEventService,
    ProcessEventById
}

