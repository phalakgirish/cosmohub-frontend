export type MenuItemTypes = {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: {
        variant: string;
        text: string;
    };
    parentKey?: string;
    target?: string;
    usershow?:Array<string>;
    children?: MenuItemTypes[];
};

const MENU_ITEMS: MenuItemTypes[] = [
    { key: 'navigation', label: 'Navigation', isTitle: true, usershow:["0","1","2"] },
    {
        key: 'dashboard',
        label: 'Dashboard',
        isTitle: false,
        icon: 'mdi mdi-view-dashboard-outline',
        // badge: { variant: 'success', text: '9+' },
        url: '/dashboard',
        usershow:["0","1","2"]
    },
    { key: 'master', label: 'Master Management', isTitle: true, usershow:["0"] },
    {
        key: 'branch',
        label: 'Branch',
        isTitle: false,
        icon: 'mdi mdi-office-building',
        usershow:["0"],
        children: [
            {
                key: 'allbranch',
                label: 'All Branch',
                url: '/branch',
                parentKey: 'branch',
            },
            {
                key: 'addbranch',
                label: 'Add Branch',
                url: '/add-branch',
                parentKey: 'branch',
            },
        ],
    },
    {
        key: 'department',
        label: 'Department',
        isTitle: false,
        icon: 'mdi mdi-domain',
        usershow:["0"],
        children: [
            {
                key: 'alldepartment',
                label: 'All Department',
                url: '/department',
                parentKey: 'department',
            },
            {
                key: 'adddepartment',
                label: 'Add Department',
                url: '/add-department',
                parentKey: 'department',
            },
        ],
    },
    {
        key: 'designation',
        label: 'Designation',
        isTitle: false,
        icon: 'mdi mdi-account-tie',
        usershow:["0"],
        children: [
            {
                key: 'alldesignation',
                label: 'All Designation',
                url: '/designation',
                parentKey: 'designation',
            },
            {
                key: 'add-designation',
                label: 'Add Designation',
                url: '/add-designation',
                parentKey: 'designation',
            },
        ],
    },
    // {
    //     key: 'sipslab',
    //     label: 'SIP Slab',
    //     isTitle: false,
    //     icon: 'mdi mdi-chart-line',
    //     url: '/SIPSlab',
    // },
    {
        key: 'sipslab',
        label: 'SIP Slab',
        isTitle: false,
        icon: 'mdi mdi-ballot',
        usershow:["0"],
        children: [
            {
                key: 'allsipslab',
                label: 'All Slab',
                url: '/sipslab',
                parentKey: 'sipslab',
            },
            {
                key: 'addsipslab',
                label: 'Add Slab',
                url: '/add-slab',
                parentKey: 'sipslab',
            },
        ],
    },

    {
        key: 'referencelevel',
        label: 'Reference Level',
        isTitle: false,
        icon: 'mdi mdi-ballot',
        usershow:["0"],
        children: [
            {
                key: 'allreferencelevel',
                label: 'All Level',
                url: '/all-referencelevel',
                parentKey: 'referencelevel',
            },
            {
                key: 'addreferencelevel',
                label: 'Add Level',
                url: '/add-referencelevel',
                parentKey: 'referencelevel',
            },
        ],
    },

    {
        key: 'sipcategory',
        label: 'SIP category',
        isTitle: false,
        icon: 'mdi mdi-ballot',
        usershow:["0"],
        children: [
            {
                key: 'allsipcategory',
                label: 'All SIP Category',
                url: '/sipcategory',
                parentKey: 'sipcategory',
            },
            {
                key: 'addsipcategory',
                label: 'Add SIP Category',
                url: '/add-sipcategory',
                parentKey: 'sipcategory',
            },
        ],
    },

    { key: 'client', label: 'Client Management', isTitle: true, usershow:["0","1","2"] },
    {
        key: 'registration',
        label: 'Add Client',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/client-registration',
        usershow:["0","1","2"],
    },
    {
        key: 'clients',
        label: 'All Client',
        isTitle: false,
        icon: 'dripicons-view-list',
        url: '/clients',
        usershow:["0","1","2"],
    },
    {
        key: 'clients',
        label: 'Import Clients',
        isTitle: false,
        icon: 'dripicons-view-list',
        url: '/importclient',
        usershow:["0","1","2"],
    },
    {
        key: 'reference_scheme_payment',
        label: 'Reference Scheme Payment',
        isTitle: false,
        icon: 'mdi mdi-ballot',
        usershow:["0","1","2"],
        children: [
            {
                key: 'allreferenceschapayment',
                label: 'All Ref. Scheme Payment',
                url: '/all-refschpayment',
                parentKey: 'reference_scheme_payment',
            },
            {
                key: 'addrefschpayment',
                label: 'Add Ref. Scheme Paymwnt',
                url: '/add-refschpayment',
                parentKey: 'reference_scheme_payment',
            },
        ],
    },
    { key: 'sip', label: 'SIP Management', isTitle: true, usershow:["0","1","2"], },
    {
        key: 'sipMember',
        label: 'SIP Member',
        isTitle: false,
        icon: 'mdi mdi-account',
        usershow:["0","1","2"],
        children: [
            {
                key: 'allsipmember',
                label: 'All Member',
                url: '/all-sipmember',
                parentKey: 'sipMember',
            },
            {
                key: 'addsipmember',
                label: 'Add Member',
                url: '/add-sipmember',
                parentKey: 'sipMember',
            },
            {
                key: 'importmember',
                label: 'Import Member',
                url: '/importmember',
                parentKey: 'sipMember',
            },
        ],
    },
    {
        key: 'sipPayment',
        label: 'SIP Payment',
        isTitle: false,
        icon: 'mdi mdi-currency-inr',
        usershow:["0","1","2"],
        children: [
            {
                key: 'allsipmember',
                label: 'All Payment',
                url: '/all-payement',
                parentKey: 'sipPayment',
            },
            {
                key: 'addpayment',
                label: 'Add Payment',
                url: '/add-payment',
                parentKey: 'sipPayment',
            },
        ],
    },
    {
        key: 'sipLuckyDraw',
        label: 'SIP Lucky Draw',
        isTitle: false,
        icon: 'mdi mdi-currency-inr',
        usershow:["0","1","2"],
        children: [
            {
                key: 'allluckydraw',
                label: 'All Lucky Draw',
                url: '/all-luckydraw',
                parentKey: 'sipLuckyDraw',
            },
            {
                key: 'addluckydraw',
                label: 'Add Lucky Draw',
                url: '/add-luckydraw',
                parentKey: 'sipLuckyDraw',
            },
        ],
    },
    {
        key: 'sipMaturity',
        label: 'SIP Maturity',
        isTitle: false,
        icon: 'mdi mdi-currency-inr',
        usershow:["0","1","2"],
        children: [
            {
                key: 'allMaturity',
                label: 'All Maturity',
                url: '/all-maturity',
                parentKey: 'sipMaturity',
            },
            {
                key: 'addMatyrity',
                label: 'Add Maturity',
                url: '/add-maturity',
                parentKey: 'sipMaturity',
            },
        ],
    },
    { key: 'Staff', label: 'Staff Management', isTitle: true, usershow:["0","1"], },
    {
        key: 'registration',
        label: 'Add Staff',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/add-staff',
        usershow:["0","1"],
    },
    {
        key: 'staff',
        label: 'All Staff',
        isTitle: false,
        icon: 'dripicons-view-list',
        url: '/staff',
        usershow:["0","1"],
    },
    {
        key: 'users',
        label: 'Users',
        isTitle: false,
        icon: 'dripicons-view-list',
        url: '/users',
        usershow:["0","1"],
    },
    { key: 'Reports', label: 'Reports', isTitle: true, usershow:["0","1","2"], },
    {
        key: 'paymentReport',
        label: 'SIP Payment Report',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/payment-report',
        usershow:["0","1","2"],
    },
    {
        key: 'memberpaymentReport',
        label: 'Member Payment Report',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/memberpayment-report',
        usershow:["0","1","2"],
    },
    {
        key: 'memberReport',
        label: 'Member Details Report',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/memberdetails-report',
        usershow:["0","1"],
    },
    {
        key: 'luckydrawReport',
        label: 'Lucky Draw Details Report',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/luckydraw-report',
        usershow:["0","1"],
    },
    {
        key: 'comissionreport',
        label: 'Clientwise Reference Comission Report',
        isTitle: false,
        icon: 'mdi mdi-account',
        url: '/comission-report',
        usershow:["0","1","2"],
    },
    // { key: 'apps', label: 'Apps', isTitle: true },
    // {
    //     key: 'apps-calendar',
    //     label: 'Calendar',
    //     isTitle: false,
    //     icon: 'mdi mdi-calendar-blank-outline',
    //     url: '/apps/calendar',
    // },
    // {
    //     key: 'apps-chat',
    //     label: 'Chat',
    //     isTitle: false,
    //     icon: 'mdi mdi-forum-outline',
    //     url: '/apps/chat',
    // },
    // {
    //     key: 'apps-email',
    //     label: 'Email',
    //     isTitle: false,
    //     icon: 'mdi mdi-email-outline',
    //     children: [
    //         {
    //             key: 'email-inbox',
    //             label: 'Inbox',
    //             url: '/apps/email/inbox',
    //             parentKey: 'apps-email',
    //         },
    //     ],
    // },
    // {
    //     key: 'apps-tasks',
    //     label: 'Tasks',
    //     isTitle: false,
    //     icon: 'mdi mdi-clipboard-outline',
    //     children: [
    //         {
    //             key: 'task-kanban',
    //             label: 'Kanban Board',
    //             url: '/apps/tasks/kanban',
    //             parentKey: 'apps-tasks',
    //         },
    //         {
    //             key: 'task-details',
    //             label: 'Details',
    //             url: '/apps/tasks/details',
    //             parentKey: 'apps-tasks',
    //         },
    //     ],
    // },
    // {
    //     key: 'apps-projects',
    //     label: 'Projects',
    //     isTitle: false,
    //     icon: 'mdi mdi-briefcase-variant-outline',
    //     url: '/apps/projects',
    // },
    // {
    //     key: 'apps-contacts',
    //     label: 'Contacts',
    //     isTitle: false,
    //     icon: 'mdi mdi-book-open-page-variant-outline',
    //     children: [
    //         {
    //             key: 'contacts-list',
    //             label: 'Members List',
    //             url: '/apps/contacts/list',
    //             parentKey: 'apps-contacts',
    //         },
    //         {
    //             key: 'contacts-profile',
    //             label: 'Profile',
    //             url: '/apps/contacts/profile',
    //             parentKey: 'apps-contacts',
    //         },
    //     ],
    // },
    // { key: 'custom', label: 'Custom', isTitle: true },
    // {
    //     key: 'extra-pages',
    //     label: 'Extra Pages',
    //     isTitle: false,
    //     icon: 'mdi mdi-file-multiple-outline',
    //     children: [
    //         {
    //             key: 'page-starter',
    //             label: 'Starter',
    //             url: '/pages/starter',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-pricing',
    //             label: 'Pricing',
    //             url: '/pages/pricing',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-timeline',
    //             label: 'Timeline',
    //             url: '/pages/timeline',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-invoice',
    //             label: 'Invoice',
    //             url: '/pages/invoice',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-faq',
    //             label: 'FAQs',
    //             url: '/pages/faq',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-gallery',
    //             label: 'Gallery',
    //             url: '/pages/gallery',
    //             parentKey: 'extra-pages',
    //         },

    //         {
    //             key: 'page-error-404',
    //             label: 'Error - 404',
    //             url: '/error-404',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-error-500',
    //             label: 'Error - 500',
    //             url: '/error-500',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-maintenance',
    //             label: 'Maintenance',
    //             url: '/maintenance',
    //             parentKey: 'extra-pages',
    //         },
    //         {
    //             key: 'page-coming-soon',
    //             label: 'Coming Soon',
    //             url: '/coming-soon',
    //             parentKey: 'extra-pages',
    //         },
    //     ],
    // },
    // { key: 'components', label: 'Components', isTitle: true },
    // {
    //     key: 'base-ui',
    //     label: 'Base UI',
    //     isTitle: false,
    //     icon: 'mdi mdi-briefcase-outline',
    //     children: [
    //         {
    //             key: 'base-ui-buttons',
    //             label: 'Buttons',
    //             url: '/base-ui/buttons',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-cards',
    //             label: 'Cards',
    //             url: '/base-ui/cards',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-avatars',
    //             label: 'Avatars',
    //             url: '/base-ui/avatars',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-tabs-accordions',
    //             label: 'Tabs & Accordions',
    //             url: '/base-ui/tabs-accordions',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-modals',
    //             label: 'Modals',
    //             url: '/base-ui/modals',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-progress',
    //             label: 'Progress',
    //             url: '/base-ui/progress',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-notifications',
    //             label: 'Notifications',
    //             url: '/base-ui/notifications',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-offcanvas',
    //             label: 'Offcanvas',
    //             url: '/base-ui/offcanvas',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-placeholders',
    //             label: 'Placeholders',
    //             url: '/base-ui/placeholders',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-spinners',
    //             label: 'Spinners',
    //             url: '/base-ui/spinners',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-images',
    //             label: 'Images',
    //             url: '/base-ui/images',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-carousel',
    //             label: 'Carousel',
    //             url: '/base-ui/carousel',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-embedvideo',
    //             label: 'Embed Video',
    //             url: '/base-ui/embedvideo',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-dropdown',
    //             label: 'Dropdowns',
    //             url: '/base-ui/dropdowns',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-popovers-tooltips',
    //             label: 'Tooltips & Popovers',
    //             url: '/base-ui/popovers-tooltips',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-general',
    //             label: 'General UI',
    //             url: '/base-ui/general',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-typography',
    //             label: 'Typography',
    //             url: '/base-ui/typography',
    //             parentKey: 'base-ui',
    //         },
    //         {
    //             key: 'base-ui-grid',
    //             label: 'Grid',
    //             url: '/base-ui/grid',
    //             parentKey: 'base-ui',
    //         },
    //     ],
    // },
    // {
    //     key: 'widgets',
    //     label: 'Widgets',
    //     isTitle: false,
    //     icon: 'mdi mdi-gift-outline',
    //     url: '/widgets',
    // },
    // {
    //     key: 'extended-ui',
    //     label: 'Extended UI',
    //     isTitle: false,
    //     icon: 'mdi mdi-layers-outline',
    //     badge: { variant: 'info', text: 'Hot' },
    //     children: [
    //         {
    //             key: 'extended-ui-nestable',
    //             label: 'Nestable List',
    //             url: '/extended-ui/nestable',
    //             parentKey: 'extended-ui',
    //         },
    //         {
    //             key: 'extended-ui-rangesliders',
    //             label: 'Range Sliders',
    //             url: '/extended-ui/rangesliders',
    //             parentKey: 'extended-ui',
    //         },
    //         {
    //             key: 'extended-ui-sweet-alert',
    //             label: 'Sweet Alert',
    //             url: '/extended-ui/sweet-alert',
    //             parentKey: 'extended-ui',
    //         },
    //         {
    //             key: 'extended-ui-tour',
    //             label: 'Tour Page',
    //             url: '/extended-ui/tour',
    //             parentKey: 'extended-ui',
    //         },
    //         {
    //             key: 'extended-ui-treeview',
    //             label: 'Tree View',
    //             url: '/extended-ui/treeview',
    //             parentKey: 'extended-ui',
    //         },
    //     ],
    // },
    // {
    //     key: 'icons',
    //     label: 'Icons',
    //     isTitle: false,
    //     icon: 'mdi mdi-shield-outline',
    //     children: [
    //         {
    //             key: 'icon-feather',
    //             label: 'Feather Icons',
    //             url: '/icons/feather',
    //             parentKey: 'icons',
    //         },
    //         {
    //             key: 'icon-mdiicons',
    //             label: 'Material Design Icons',
    //             url: '/icons/mdi',
    //             parentKey: 'icons',
    //         },
    //         {
    //             key: 'icon-dripicons',
    //             label: 'Dripicons',
    //             url: '/icons/dripicons',
    //             parentKey: 'icons',
    //         },
    //         {
    //             key: 'icon-font-awesome',
    //             label: 'Font Awesome 5',
    //             url: '/icons/font-awesome',
    //             parentKey: 'icons',
    //         },
    //         {
    //             key: 'icon-themify',
    //             label: 'Themify',
    //             url: '/icons/themify',
    //             parentKey: 'icons',
    //         },
    //     ],
    // },
    // {
    //     key: 'forms',
    //     label: 'Forms',
    //     isTitle: false,
    //     icon: 'mdi mdi-texture',
    //     children: [
    //         {
    //             key: 'form-basic',
    //             label: 'General Elements',
    //             url: '/forms/basic',
    //             parentKey: 'forms',
    //         },
    //         {
    //             key: 'form-advanced',
    //             label: 'Form Advanced',
    //             url: '/forms/advanced',
    //             parentKey: 'forms',
    //         },
    //         {
    //             key: 'form-validation',
    //             label: 'Validation',
    //             url: '/forms/validation',
    //             parentKey: 'forms',
    //         },
    //         {
    //             key: 'form-wizard',
    //             label: 'Wizard',
    //             url: '/forms/wizard',
    //             parentKey: 'forms',
    //         },
    //         {
    //             key: 'form-upload',
    //             label: 'File Uploads',
    //             url: '/forms/upload',
    //             parentKey: 'forms',
    //         },
    //         {
    //             key: 'form-editors',
    //             label: 'Editors',
    //             url: '/forms/editors',
    //             parentKey: 'forms',
    //         },
    //     ],
    // },
    // {
    //     key: 'tables',
    //     label: 'Tables',
    //     isTitle: false,
    //     icon: 'mdi mdi-table',
    //     children: [
    //         {
    //             key: 'table-basic',
    //             label: 'Basic Tables',
    //             url: '/tables/basic',
    //             parentKey: 'tables',
    //         },
    //         {
    //             key: 'table-advanced',
    //             label: 'Advanced Tables',
    //             url: '/tables/advanced',
    //             parentKey: 'tables',
    //         },
    //     ],
    // },
    // {
    //     key: 'charts',
    //     label: 'Charts',
    //     isTitle: false,
    //     icon: 'mdi mdi-chart-donut-variant',
    //     children: [
    //         {
    //             key: 'chart-apex',
    //             label: 'Apex Charts',
    //             url: '/charts/apex',
    //             parentKey: 'charts',
    //         },
    //         {
    //             key: 'chart-chartjs',
    //             label: 'Chartjs',
    //             url: '/charts/chartjs',
    //             parentKey: 'charts',
    //         },
    //     ],
    // },
    // {
    //     key: 'maps',
    //     label: 'Maps',
    //     isTitle: false,
    //     icon: 'mdi mdi-map-outline',
    //     children: [
    //         {
    //             key: 'maps-googlemaps',
    //             label: 'Google Maps',
    //             url: '/maps/google',
    //             parentKey: 'maps',
    //         },
    //         {
    //             key: 'maps-vectormaps',
    //             label: 'Vector Maps',
    //             url: '/maps/vector',
    //             parentKey: 'maps',
    //         },
    //     ],
    // },
    // {
    //     key: 'menu-levels',
    //     label: 'Menu Levels',
    //     isTitle: false,
    //     icon: 'mdi mdi-share-variant',
    //     children: [
    //         {
    //             key: 'menu-levels-1-1',
    //             label: 'Level 1.1',
    //             url: '/',
    //             parentKey: 'menu-levels',
    //             children: [
    //                 {
    //                     key: 'menu-levels-2-1',
    //                     label: 'Level 2.1',
    //                     url: '/',
    //                     parentKey: 'menu-levels-1-1',
    //                     children: [
    //                         {
    //                             key: 'menu-levels-3-1',
    //                             label: 'Level 3.1',
    //                             url: '/',
    //                             parentKey: 'menu-levels-2-1',
    //                         },
    //                         {
    //                             key: 'menu-levels-3-2',
    //                             label: 'Level 3.2',
    //                             url: '/',
    //                             parentKey: 'menu-levels-2-1',
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     key: 'menu-levels-2-2',
    //                     label: 'Level 2.2',
    //                     url: '/',
    //                     parentKey: 'menu-levels-1-1',
    //                 },
    //             ],
    //         },
    //         {
    //             key: 'menu-levels-1-2',
    //             label: 'Level 1.2',
    //             url: '/',
    //             parentKey: 'menu-levels',
    //         },
    //     ],
    // },
];



export { MENU_ITEMS };
