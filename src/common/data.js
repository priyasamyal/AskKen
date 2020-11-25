export default commonData = {
  ToastMessages: {
    no_internet:
      "You're not connected to the internet — try again when you have a good connection.",
    video_no_internet:
      "There was a problem with the network. Try reconnecting again.",
    session_expire:
      "You've been logged out for security purposes, please login again.",
    camera_deny_permission:
      'Ask Ken needs permission to access your camera to upload photos and for video calls with Experts.',
    verfication_error: 'The verification code you entered is incorrect.',
    verfication_otp: 'Please enter your verification code.',
    update_profile: 'Your account has been updated.',
    no_expert_found: 'There are no available experts to help — try again soon.',
    tip: 'Thanks for the tip!',
    push_permission:
      'Ask Ken would like to send you notifications — to continue, tap Settings > Notifications, and turn Notifictions on.',
    push_alert:
      "If you disable push notifications. You won't be able to receive home owner's calls.",
    access_gallery:
      'Ask Ken need to access your photo library so you can upload photos to your profile or license.',
    delete_photo: 'Are you sure you want to delete the license picture?',
    max_category:
      'You can select up to three categories — unlock more over time with good reviews.',
    call_timeout: 'All experts are busy — try again in three to five minutes.',
    stripe_connect:
      "You haven't setup your secure Stripe account yet — this is what you need to start receiving calls and get paid.",
    delete_account: 'Are you sure you want to delete your account?',
    ask_refund: 'Do you want a refund?',
    access_micro_phone:
    'Ask Ken needs permission to access your microphone to make calls or receive calls.',
    card_holder_name: 'Please enter your card holder name.',
    first_name: 'Please enter your first name.',
    card_last: 'Please enter your last name.',
    valid_card_holder_name: 'Please enter your valid card holder name.',
    card_number: 'Please enter your card number.',
    valid_card: 'Please enter valid card number.',
    expiration: 'Please select your card expiration month/year.',
    cvv: 'Please enter cvv number.',
    zip: 'Please enter zip code.',
    ssn: 'Please enter last four digit of your social.',
    ssn_full: 'Please enter 9 digit of your social.',
    dob: 'Please enter dob.',
    email: 'Please enter email.',
    business_type: 'Please select business type.',
    street: 'Please enter address.',
    city: 'Please enter city.',
    state: 'Please enter state.',
    password: 'Please enter password.',
    zip_code: 'Please enter zip code.',
    phone_number: 'Please enter mobile number.',
    phone_number_validation: 'Check your phone number and enter it again.',
    update_app_msg:
      'You are using an older version of the app. Please, update it to the latest version.',
    full_ssn_prompt:
      'There is error in verifying your SSN. Please add full SSN and resubmit.',
    card_holder_info_error:
      'There is an error in verifying card holder address. Please review your address details and resubmit.',
    pending_verification_msg:
      'Your identity is being verified. To check your status, tap the menu icon in the top right corner, then tap "Edit Payout Info."',
    pending_transfered_enable:
      "Your account has been verified and\nyour earnings will now automatically\nbe transferred to your bank account\nat the end of each day.",
    review_msg:
      "We are currently reviewing your details. Please wait for some time and check again or contact admin if this message persists.",
    refund_msg: 'You request for refund has been initiated. You will hear from us within 2 working days.',

    video_duration: 'Please select video upto 15 seconds.',
    old_password: 'Please enter your old password.',
    new_password: 'Please enter your new password.',
    confirm_password: 'Please enter your confirm password.',
    pass_not_match: 'Your new password and confirm password does not match.'
  },
  apn_token: 'helo',
  current_version: 2.2,
  latest_version: 2.2,
  connect: '',
  profile_picture_url: 'https://www.askkenapp.com/api/v2/uploads/profile/',
  license_image_url: 'https://www.askkenapp.com/api/v2/uploads/license/',
  ticket_image: 'https://www.askkenapp.com/api/v2/uploads/ticket_files/',
  ticket_video: 'https://askkenvideos.s3.us-east-2.amazonaws.com/uploads/',
  chat_image_url: "https://askkenvideos.s3.us-east-2.amazonaws.com/chat_image/",
  signUpObj: {
    phone_number: '',
    phone_code: '',
    name: '',
    categories: '',
    password: '',
    profile_image: '',
    license_image: '',
    user_type: '',
    device_token: 'asasasasass',
    verification_code: '',
    uuid: '',
  },
  time_zone: "America/New_York",
  signupParam: new FormData(),
  api_endpoint: {
    forgot_password: '/users/forgot_password',
    login: '/users/login',
    signup: '/users/signUp',
    verfiy_user: '/users/verifyUser',
    update_profile: '/users/edit_profile',
    get_countries: '/users/get_common_details',
    get_states: '/states',
    delete_account: '/users/delete_user',
    log_out: '/users/logout',
    user_details: '/users/user_detail',
    verify_phone_code: '/users/verifyPhoneCode',
    search_expert: '/users/search_expert',
    add_tip: '/call/add_tip',
    review: '/call/review',
    call_history: '/call/call_history',
    add_card: '/payment/add_card',
    get_status: '/stripe/check_keys',
    intial_payment: '/payment/intiate_payment',
    push_payload: '/call/notify_allusers',
    create_session: '/call/create_session',
    connect: '/call/connect',
    refund: '/user/refund_amount',
    stripe_connect: '/connect-stripe',
    request_refund: '/send-mail',
    refund_amount: '/user/refund_expert_amount',
    earningsHistory: "/call/expert_call_history",

    post_ticket: '/tickets/add-ticket',
    chatList: "/chats/get-chats",
    reject_ticket: '/tickets/reject-ticket-expert',
    accept_ticket: '/tickets/accept-ticket',
    getChatList: '/chats/get-chat-by-id',
    change_password: '/users/change-password',
    silent_push: '/push/silent-push',
    regenerate_ticket: '/tickets/regenerate-ticket',
    ticket_detail: '/tickets/ticket_detail',
    missed_call: '/call/missed',
    complete_ticket: '/tickets/complete_ticket',
    reject_request: '/tickets/reject_request',
    mark_read: '/notification/mark-read',
  //  mark_read: '/notification/mark-read',


  },
  country_codes: '',
  user_details: { cards: [] },
  user_phone_number: '',
  categories: [],
  stripe_connected_url:
    'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_GWIOqFqwxPtfMRmSy9k3jqCaTjhqfkgQ&always_prompt=true&scope=read_write&redirect_uri=https://www.askkenapp.com/api/public/stripe_connect&state=',

  payment_card_details: {},
  push_payload: '',
  manual_end_uuid: '',
  stripe_status: {
    charge_enabled: 0,
    errors: [],
    transfer_enabled: 0
  },

  ad_index:0,
  business_type: [
    {
      name: 'A/C, Refrigeration Repair',
      id: '7623',
    },
    {
      name: 'Auto Service Shops',
      id: '7538',
    },
    {
      name: 'Car Washes',
      id: '7542',
    },
    {
      name: 'Carpentry Services',
      id: '1750',
    },
    {
      name: 'Carpet/Upholstery Cleanings',
      id: '7217',
    },
    {
      name: 'Cleaning and Maintenance',
      id: '7349',
    },
    {
      name: 'Electrical Services',
      id: '1731',
    },
    {
      name: 'Electronics Repair Shops',
      id: '7622',
    },
    {
      name: 'Computer Repair',
      id: '7379',
    },
    {
      name: 'Drapery, Window Covering, and Upholstery Stores',
      id: '5714',
    },
    {
      name: 'Floor Covering Stores',
      id: '5713',
    },
    {
      name: 'Furniture Repair, Refinishing',
      id: '7641',
    },
    {
      name: 'Glass, Paint, and Wallpaper Stores',
      id: '5231',
    },
    {
      name: 'Heating, Plumbing, A/C',
      id: '1711',
    },
    {
      name: 'Laundry, Cleaning Services',
      id: '7210',
    },
    {
      name: 'Miscellaneous Repair Shops',
      id: '7699',
    },
    {
      name: 'Motorcycle Shops and Dealers',
      id: '5571',
    },
    {
      name: 'Nurseries, Lawn and Garden Supply Stores',
      id: '5261',
    },
    {
      name: 'Paints, Varnishes, and Supplies',
      id: '5198',
    },
    {
      name: 'Parking Lots, Garages',
      id: '7523',
    },
    {
      name: 'Professional Services',
      id: '8999',
    },
    {
      name: 'Roofing/Siding, Sheet Metal',
      id: '1761',
    },
    {
      name: 'Small Appliance Repair',
      id: '7629',
    },
    {
      name: 'Telecommunication Services',
      id: '4814',
    },
    {
      name: 'Welding Repair',
      id: '7692',
    },
  ],

  pro_home_menu: [{
    name: 'Help',
    img: require('./../assets/imgs/help.png'),
    disable: false,
    type: 'help'
  },
  {
    name: 'Edit Profile Photo',
    img: require('./../assets/imgs/edit_profile.png'),
    disable: false,
    type: 'updateProfile'
  },
  {
    name: 'Add Payout Info',
    img: require('./../assets/imgs/edi_payout_active.png'),
    disable: false,
    type: 'paymentInfo'
  },
  {
    name: 'Edit Area of Expertise',
    img: require('./../assets/imgs/expertise.png'),
    disable: false,
    type: 'expertise'
  },
  {
    name: 'Edit Account Info',
    img: require('./../assets/imgs/account.png'),
    disable: false,
    type: 'account'
  },
  {
    name: 'Push Notification',
    img: require('./../assets/imgs/push.png'),
    disable: false,
    type: 'push'
  },
  {
    name: 'Report A Problem',
    img: require('./../assets/imgs/report.png'),
    disable: false,
    type: 'report'
  },
  {
    name: 'Logout',
    img: require('./../assets/imgs/logout.png'),
    disable: true,
    type: 'logout'

  },
  {
    name: 'Terms & Privacy',
    img: require('./../assets/imgs/terms.png'),
    disable: true,
    type: 'terms'
  }
  ],

  owner_menu_chat: [
    {
      name: "Pay Pro, I'm Satisfied",
      img: require('./../assets/imgs/menu_complete.png'),
      disable: false,
      type: 'pay'
    },
    {
      name: 'Replace Pro',
      img: require('./../assets/imgs/menu_refresh.png'),
      disable: false,
      type: 'find'
    },
    {
      name: "This Didn't Work, Lets Start Over",
      img: require('./../assets/imgs/menu_delete.png'),
      disable: false,
      type: 'over'
    },
    {
      name: 'Help',
      img: require('./../assets/imgs/help.png'),
      disable: false,
      type: 'help'
    },
    {
      name: 'Call History',
      img: require('./../assets/imgs/call.png'),
      disable: false,
      type: 'call_hitsory'
    },
    {
      name: 'Add Credit Card Info',
      img: require('./../assets/imgs/edi_payout_active.png'),
      disable: false,
      type: 'paymentInfo'
    },
    {
      name: 'Edit Profile',
      img: require('./../assets/imgs/account.png'),
      disable: false,
      type: 'account'
    },
    {
      name: 'Push Notification',
      img: require('./../assets/imgs/push.png'),
      disable: false,
      type: 'push'
    },
    {
      name: 'Report A Problem',
      img: require('./../assets/imgs/report.png'),
      disable: false,
      type: 'report'
    },
    {
      name: 'Logout',
      img: require('./../assets/imgs/logout.png'),
      disable: true,
      type: 'logout'

    },
    {
      name: 'Terms & Privacy',
      img: require('./../assets/imgs/terms.png'),
      disable: true,
      type: 'terms'
    }

  ]
  ,
  expert_menu_chat: [
    {
      name: "Call Customer",
      img: require('./../assets/imgs/call_menu.png'),
      disable: false,
      type: 'call'
    },
    {
      name: 'Job Completed',
      img: require('./../assets/imgs/menu_complete.png'),
      disable: false,
      type: 'find'
    },
    {
      name: "I Can't Help, Assign New Pro",
      img: require('./../assets/imgs/menu_refresh.png'),
      disable: false,
      type: 'over'
    }

  ]
  ,
  owner_menu: [{
    name: 'Help',
    img: require('./../assets/imgs/help.png'),
    disable: false,
    type: 'help'
  },
  {
    name: 'Call History',
    img: require('./../assets/imgs/call.png'),
    disable: false,
    type: 'call_hitsory'
  },
  {
    name: 'Add Credit Card Info',
    img: require('./../assets/imgs/edi_payout_active.png'),
    disable: false,
    type: 'paymentInfo'
  },
  {
    name: 'Edit Profile',
    img: require('./../assets/imgs/account.png'),
    disable: false,
    type: 'account'
  },
  {
    name: 'Push Notification',
    img: require('./../assets/imgs/push.png'),
    disable: false,
    type: 'push'
  },
  {
    name: 'Report A Problem',
    img: require('./../assets/imgs/report.png'),
    disable: false,
    type: 'report'
  },
  {
    name: 'Logout',
    img: require('./../assets/imgs/logout.png'),
    disable: true,
    type: 'logout'

  },
  {
    name: 'Terms & Privacy',
    img: require('./../assets/imgs/terms.png'),
    disable: true,
    type: 'terms'
  }
  ]

};
