export type Lang = "en" | "ta";

export const translations = {
  en: {
    // Navbar
    home: "Home",
    submitGrievance: "Submit Grievance",
    trackStatus: "Track Status",
    dashboard: "Dashboard",
    admin: "Admin",
    forgotToken: "Forgot Token",
    login: "Login",
    logout: "Logout",
    officialPortal: "Namathu Muyarchi.. Karur Valarchi..",
    tollFree: "Toll Free: 1800-111-555",
    portalName: "Karur Grievance Portal",
    portalTagline: "Makkalai Kaakum Arasu",

    // Home
    heroTitle: "Karur Public Grievance Portal ",
    
    heroDesc:
      "This is an online grievance portal created by our brother V. Senthil Balaji to address the issues and concerns of the people of Karur.",
      heroParagraph:"Always For You, Always With You..!",
    submitBtn: "Submit Grievance",
    trackBtn: "Track Status",
    totalGrievances: "Grievances Filed",
    resolved: "Resolved",
    inProgress: "In Progress",
    citizensServed: "Citizens Served",
    lakh: "Lakh",
    howItWorks: "How It Works",
    simpleProcess: "Simple Process",
    stepsDesc: "File and track your grievance in 4 easy steps",
    step1Title: "Submit Complaint",
    step1Desc:
      "Fill the form with your name, mobile, department, and describe your problem.",
    step2Title: "Get Your Token",
    step2Desc:
      "A unique token is generated. Save it to track your grievance anytime.",
    step3Title: "Official Review",
    step3Desc:
      "Your complaint is reviewed and assigned to the concerned department officer.",
    step4Title: "Resolution",
    step4Desc:
      "Action is taken and you are notified. Track progress at every stage.",
    haveGrievance: "Have a grievance?",
    ctaDesc:
      "Don't wait. File your complaint online now and we'll make sure the right department takes action.",
    fileNow: "File Complaint Now →",
    schemesTitle: "Chief Minister's Schemes",
    schemesSubtitle:
      "Muthalvarin Mugavari — Welfare Schemes for Tamil Nadu Citizens",
    viewAllSchemes: "View All Schemes",
    applyNow: "Apply Now",

    // Submit
    fileGrievance: "File Your Grievance",
    processedIn: "Your complaint will be processed within 30 working days.",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    department: "Department",
    describeYourProblem: "Describe Your Problem",
    namePlaceholder: "e.g. Ramesh Kumar",
    mobilePlaceholder: "10-digit mobile number",
    descPlaceholder:
      "Please describe your issue in detail. Include location, dates, and any relevant information...",
    submitBtn2: "Submit Grievance →",
    successTitle: "Grievance Submitted!",
    successDesc: "Your complaint has been registered. Please save your token.",
    uniqueToken: "Your Unique Token",
    copyToken: "Copy Token",
    copied: "Copied!",
    importantNote:
      "⚠️ Important: Save this token to track your grievance status.",
    submitAnother: "Submit Another Grievance",
    instructions: "Instructions",
    inst1: "Provide accurate information for faster resolution",
    inst2: "A unique token will be generated — save it to track status",
    inst3: "You can also find your token using your mobile number",

    emailAddress: "Email Address",
    emailPlaceholder: "e.g. example@email.com",
    address: "Address",
    addressPlaceholder: "Enter your full address",
    addressRequired: "Address is required",
    invalidEmail: "Enter a valid email address",
    constituency: "Constituency",
    constituencyRequired: "Constituency is required",

    // Track
    trackGrievance: "Track Your Grievance",
    enterTokenDesc: "Enter your token to see real-time status.",
    grievanceToken: "Grievance Token",
    tokenPlaceholder: "e.g. GRV25ABCD12",
    trackBtnLabel: "Track →",
    forgotTokenLink: "Recover using mobile number",
    dontHaveToken: "Don't have your token?",
    searchAnother: "Search another token",
    officialRemark: "Official Remark:",
    grievanceProgress: "Grievance Progress",

    // Forgot Token
    recoverToken: "Recover Your Token",
    recoverDesc: "Find all grievances linked to your mobile number.",
    regMobile: "Registered Mobile Number",
    findTokens: "Find Tokens",
    grievancesFound: "grievance(s) found",
    clear: "Clear",

    // Login
    adminLogin: "Admin Login",
    ministerLogin: "Minister Login",
    username: "Username",
    password: "Password",
    loginBtn: "Login →",
    loginError: "Invalid username or password",
    adminCred: "Demo: admin / admin123",
    ministerCred: "Demo: minister / tnmin123",

    // Dashboard
    grievanceDashboard: "Grievance Dashboard",
    overview: "Overview of all submitted grievances",
    totalGrievancesCard: "Total Grievances",
    pendingReview: "Pending Review",
    statusDistribution: "Status Distribution",
    allDepartments: "All Departments",
    allStatuses: "All Statuses",
    searchPlaceholder: "Search by token, name or description...",
    showing: "Showing",
    of: "of",
    grievances: "grievances",

    // Admin
    adminPanel: "Admin Control Panel",
    manageGrievances: "Manage and update grievance statuses",
    edit: "Edit",
    editGrievance: "Edit Grievance",
    updateStatus: "Update Status",
    assignTo: "Assign To",
    assignPlaceholder: "e.g. District Collector, Block Officer...",
    officialRemarks: "Official Remarks",
    remarksPlaceholder: "Add action taken or remarks...",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    records: "records",

    // Status
    submitted: "Submitted",
    underReview: "Under Review",
    assigned: "Assigned",
    inProgressLabel: "In Progress",
    resolvedLabel: "Resolved",
    closed: "Closed",
    submittedDesc: "Grievance registered successfully",
    underReviewDesc: "Being reviewed by officials",
    assignedDesc: "Assigned to department officer",
    inProgressDesc: "Action is being taken",
    resolvedDesc: "Issue has been resolved",
    closedDesc: "Case closed successfully",
    current: "Current",

    // Footer
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    helpline: "Helpline",
    copyright: "© 2025 Government of Tamil Nadu. All rights reserved.",
    designed: "Designed & Developed by NIC | Last Updated: March 2025",

    // Validation
    nameRequired: "Name is required",
    invalidMobile: "Enter a valid 10-digit mobile number",
    descTooShort: "Please describe your issue in at least 20 characters",
    enterToken: "Please enter your grievance token",
    noGrievanceToken: "No grievance found with this token.",
    noGrievanceMobile: "No grievances found for this mobile number.",

    //query modal
    grievanceQueries: "Grievance Queries",
    user: "User",
    noQueries: "No queries yet",
    writeQueryPlaceholder: "Write your query here...",
    sending: "Sending...",
    sendQuery: "Send Query",

    //constituencies
    selectConstituency: "Select Constituency",

    //attach documents
    attachDocument: "Attach Document (Optional)",
    chooseFile: "Choose PDF, Image, or Document (Max 5MB)",
    openCamera: "Open Camera",
    capturePhoto: "Capture Photo",

    departmentBreakdown: "Department-wise Breakdown",
  },
  ta: {
    // Navbar
    home: "முகப்பு",
    submitGrievance: "புகார் சமர்ப்பிக்க",
    trackStatus: "நிலை கண்காணி",
    dashboard: "டாஷ்போர்டு",
    admin: "நிர்வாகி",
    forgotToken: "டோக்கன் மறந்தீர்களா",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    officialPortal: "நமது முயற்சி.. கரூர் வளர்ச்சி..",
    tollFree: "இலவச அழைப்பு: 1800-111-555",
    portalName: "கரூர் மக்களின் குறைதீர் தளம்",
    portalTagline: "மக்களை காக்கும் அரசு",

    // Home
    heroTitle: "கரூர் மக்களின் குறைதீர் தளம்",
    heroDesc:
      "கரூர் மக்களின் குறைகளை தீர்க்க உங்கள் சகோதரர் v.செந்தில் பாலாஜி அவர்களால் ஏற்படுத்தப்பட்ட இணையதள புகார்தளம்.",
     heroParagraph:
      "உங்களுக்காக உங்களுடன் எப்போதும் உறுதுணையாக இருப்போம்.",
    submitBtn: "புகார் சமர்ப்பி",
    trackBtn: "நிலை கண்காணி",
    totalGrievances: "சமர்ப்பிக்கப்பட்ட புகார்கள்",
    resolved: "தீர்க்கப்பட்டவை",
    inProgress: "நடவடிக்கையில்",
    citizensServed: "பயனடைந்த மக்கள்",
    lakh: "லட்சம்",
    howItWorks: "எவ்வாறு செயல்படுகிறது",
    simpleProcess: "எளிய செயல்முறை",
    stepsDesc: "4 எளிய படிகளில் புகார் சமர்ப்பிக்கவும்",
    step1Title: "புகார் சமர்ப்பி",
    step1Desc: "உங்கள் பெயர், மொபைல், துறை மற்றும் பிரச்சனையை விவரிக்கவும்.",
    step2Title: "டோக்கன் பெறுக",
    step2Desc: "தனித்துவமான டோக்கன் உருவாகும். நிலை கண்காணிக்க சேமிக்கவும்.",
    step3Title: "அதிகாரி ஆய்வு",
    step3Desc:
      "உங்கள் புகார் ஆய்வு செய்யப்பட்டு சம்பந்தப்பட்ட அதிகாரிக்கு ஒதுக்கப்படும்.",
    step4Title: "தீர்வு",
    step4Desc:
      "நடவடிக்கை எடுக்கப்பட்டு தெரிவிக்கப்படும். ஒவ்வொரு நிலையிலும் கண்காணிக்கவும்.",
    haveGrievance: "புகார் உள்ளதா?",
    ctaDesc: "தாமதிக்காதீர்கள். இப்போதே ஆன்லைனில் புகார் சமர்ப்பிக்கவும்.",
    fileNow: "புகார் சமர்ப்பி →",
    schemesTitle: "முதலமைச்சரின் திட்டங்கள்",
    schemesSubtitle: "முதல்வரின் முகவரி — தமிழக மக்களுக்கான நலத் திட்டங்கள்",
    viewAllSchemes: "அனைத்து திட்டங்களும்",
    applyNow: "விண்ணப்பிக்க",

    // Submit
    fileGrievance: "புகார் பதிவு செய்க",
    processedIn: "உங்கள் புகார் 30 நாட்களுக்குள் செயல்படுத்தப்படும்.",
    fullName: "முழு பெயர்",
    mobileNumber: "மொபைல் எண்",
    department: "துறை",
    describeYourProblem: "பிரச்சனையை விவரிக்கவும்",
    namePlaceholder: "எ.கா. ரமேஷ் குமார்",
    mobilePlaceholder: "10 இலக்க மொபைல் எண்",
    descPlaceholder:
      "உங்கள் பிரச்சனையை விரிவாக விவரிக்கவும். இடம், தேதி, மற்றும் தொடர்புடைய தகவல்களை சேர்க்கவும்...",
    submitBtn2: "புகார் சமர்ப்பி →",
    successTitle: "புகார் சமர்ப்பிக்கப்பட்டது!",
    successDesc: "உங்கள் புகார் பதிவு செய்யப்பட்டது. டோக்கனை சேமிக்கவும்.",
    uniqueToken: "உங்கள் தனித்துவ டோக்கன்",
    copyToken: "டோக்கன் நகல் எடு",
    copied: "நகல் எடுக்கப்பட்டது!",
    importantNote:
      "⚠️ முக்கியம்: புகாரின் நிலையை கண்காணிக்க இந்த டோக்கனை சேமிக்கவும்.",
    submitAnother: "மற்றொரு புகார் சமர்ப்பி",
    instructions: "வழிமுறைகள்",
    inst1: "விரைவான தீர்வுக்கு சரியான தகவல்களை வழங்கவும்",
    inst2: "தனித்துவமான டோக்கன் உருவாகும் — நிலை கண்காணிக்க சேமிக்கவும்",
    inst3: "மொபைல் எண் மூலமும் டோக்கன் பெறலாம்",

    emailAddress: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "எ.கா. example@email.com",
    address: "முகவரி",
    addressPlaceholder: "உங்கள் முழு முகவரியை உள்ளிடவும்",
    addressRequired: "முகவரி அவசியம்",
    invalidEmail: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    constituency: "மாநில தொகுதி",
    constituencyRequired: "மாநில தொகுதி தேவை",

    // Track
    trackGrievance: "புகாரின் நிலை கண்காணி",
    enterTokenDesc: "நேரடி நிலையை பார்க்க உங்கள் டோக்கனை உள்ளிடவும்.",
    grievanceToken: "புகார் டோக்கன்",
    tokenPlaceholder: "எ.கா. GRV25ABCD12",
    trackBtnLabel: "கண்காணி →",
    forgotTokenLink: "மொபைல் மூலம் மீட்டெடு",
    dontHaveToken: "டோக்கன் இல்லையா?",
    searchAnother: "மற்றொரு டோக்கன் தேடு",
    officialRemark: "அதிகாரி குறிப்பு:",
    grievanceProgress: "புகார் நிலை பயணம்",

    // Forgot Token
    recoverToken: "டோக்கன் மீட்டெடு",
    recoverDesc:
      "உங்கள் மொபைல் எண்ணுடன் தொடர்புடைய அனைத்து புகார்களையும் காணவும்.",
    regMobile: "பதிவு செய்யப்பட்ட மொபைல் எண்",
    findTokens: "டோக்கன்கள் தேடு",
    grievancesFound: "புகார்கள் கண்டுபிடிக்கப்பட்டன",
    clear: "அழி",

    // Login
    adminLogin: "நிர்வாகி உள்நுழைவு",
    ministerLogin: "அமைச்சர் உள்நுழைவு",
    username: "பயனர் பெயர்",
    password: "கடவுச்சொல்",
    loginBtn: "உள்நுழை →",
    loginError: "தவறான பயனர் பெயர் அல்லது கடவுச்சொல்",
    adminCred: "டெமோ: admin / admin123",
    ministerCred: "டெமோ: minister / tnmin123",

    // Dashboard
    grievanceDashboard: "புகார் டாஷ்போர்டு",
    overview: "அனைத்து புகார்களின் கண்ணோட்டம்",
    totalGrievancesCard: "மொத்த புகார்கள்",
    pendingReview: "ஆய்வு நிலுவையில்",
    statusDistribution: "நிலை பகிர்வு",
    allDepartments: "அனைத்து துறைகள்",
    allStatuses: "அனைத்து நிலைகளும்",
    searchPlaceholder: "டோக்கன், பெயர் அல்லது விவரம் தேடு...",
    showing: "காட்டுகிறது",
    of: "இல்",
    grievances: "புகார்கள்",

    // Admin
    adminPanel: "நிர்வாக கட்டுப்பாட்டு பலகை",
    manageGrievances: "புகார் நிலைகளை நிர்வகிக்கவும்",
    edit: "திருத்து",
    editGrievance: "புகார் திருத்து",
    updateStatus: "நிலை புதுப்பி",
    assignTo: "யாருக்கு ஒதுக்கு",
    assignPlaceholder: "எ.கா. மாவட்ட ஆட்சியர், வட்டாட்சியர்...",
    officialRemarks: "அதிகாரி குறிப்புகள்",
    remarksPlaceholder:
      "எடுக்கப்பட்ட நடவடிக்கை அல்லது குறிப்புகளை சேர்க்கவும்...",
    cancel: "ரத்து செய்",
    saveChanges: "மாற்றங்களை சேமி",
    records: "பதிவுகள்",

    // Status
    submitted: "சமர்ப்பிக்கப்பட்டது",
    underReview: "ஆய்வில்",
    assigned: "ஒதுக்கப்பட்டது",
    inProgressLabel: "நடவடிக்கையில்",
    resolvedLabel: "தீர்க்கப்பட்டது",
    closed: "மூடப்பட்டது",
    submittedDesc: "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது",
    underReviewDesc: "அதிகாரிகளால் ஆய்வு செய்யப்படுகிறது",
    assignedDesc: "துறை அதிகாரிக்கு ஒதுக்கப்பட்டது",
    inProgressDesc: "நடவடிக்கை எடுக்கப்படுகிறது",
    resolvedDesc: "பிரச்சனை தீர்க்கப்பட்டது",
    closedDesc: "வழக்கு வெற்றிகரமாக மூடப்பட்டது",
    current: "தற்போதைய",

    // Footer
    quickLinks: "விரைவு இணைப்புகள்",
    contactUs: "தொடர்பு கொள்ள",
    helpline: "உதவி எண்",
    copyright: "© 2025 தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    designed: "NIC மூலம் வடிவமைக்கப்பட்டது | மார்ச் 2025",

    // Validation
    nameRequired: "பெயர் அவசியம்",
    invalidMobile: "சரியான 10 இலக்க மொபைல் எண் உள்ளிடவும்",
    descTooShort: "குறைந்தது 20 எழுத்துகளில் விவரிக்கவும்",
    enterToken: "புகார் டோக்கனை உள்ளிடவும்",
    noGrievanceToken: "இந்த டோக்கனுடன் புகார் எதுவும் கண்டுபிடிக்கவில்லை.",
    noGrievanceMobile:
      "இந்த மொபைல் எண்ணுடன் புகார் எதுவும் கண்டுபிடிக்கவில்லை.",

    //query modal
    grievanceQueries: "புகார் கேள்விகள்",
    user: "பயனர்",
    noQueries: "இதுவரை கேள்விகள் இல்லை",
    writeQueryPlaceholder: "உங்கள் கேள்வியை எழுதுங்கள்...",
    sending: "அனுப்பப்படுகிறது...",
    sendQuery: "கேள்வியை அனுப்பு",

    //constituencies
    selectConstituency: "தொகுதியை தேர்ந்தெடுக்கவும்",

    //attach documents
    attachDocument: "ஆவணம் இணைக்கவும் (விருப்பம்)",
    chooseFile: "PDF, படம் அல்லது ஆவணத்தை தேர்வு செய்யவும் (அதிகபட்சம் 5MB)",
    openCamera: "கேமராவை திற",
    capturePhoto: "புகைப்படம் எடு",

    departmentBreakdown: "துறைவாரியான பகிர்வு",
  },
};

export type TranslationKey = keyof typeof translations.en;