import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

// layouts
import DefaultLayout from '../layouts/Default';
import VerticalLayout from '../layouts/Vertical';
import HorizontalLayout from '../layouts/Horizontal/';

// components
import PrivateRoute from './PrivateRoute';
import Root from './Root';

// constants
import { LayoutTypes } from '../constants';

// hooks
import { useRedux } from '../hooks';
// import EditDepartment from '../pages/Master/EditDeprtment';
// lazy load all the views
// auth
const Branch = React.lazy(() => import('../pages/Master/Branch'));
const AddBranch = React.lazy(() => import('../pages/Master/AddBranch'));

const Department = React.lazy(() => import('../pages/Master/Department'));
const AddDepartment = React.lazy(() => import('../pages/Master/AddDepartment'));

const Designation = React.lazy(() => import('../pages/Master/Designation'));
const AddDesignation = React.lazy(() => import('../pages/Master/AddDesignation'));

const ClientRegistration = React.lazy(() => import('../pages/ClientManagement/ClientRegistration'));
const AllClients = React.lazy(() => import('../pages/ClientManagement/Clients'));
const EditClient = React.lazy(() => import('../pages/ClientManagement/EditClient'));
const ImportClient = React.lazy(() => import('../pages/ClientManagement/ImportClient'));


const AddRefSchPayment = React.lazy(() => import('../pages/ClientManagement/AddRefSchPayment'));
const AllRefSchPayment = React.lazy(() => import('../pages/ClientManagement/ReferenceSchPayment'));
const EditRefSchPayment = React.lazy(() => import('../pages/ClientManagement/EditRefSchPayment'));


const EditBranch = React.lazy(() => import('../pages/Master/EditBranch'));
const EditDepartment = React.lazy(() => import('../pages/Master/EditDeprtment'));
const EditDesignation = React.lazy(() => import('../pages/Master/EditDesignation'));

const AddReferenceLevel= React.lazy(() => import('../pages/Master/AddReferenceLevel'));
const AllReferenceLevel= React.lazy(() => import('../pages/Master/AllReferenceLevel'));
const EditReferenceLevel = React.lazy(() => import('../pages/Master/EditReferenceLevel'));

const AddStaff = React.lazy(() => import('../pages/StaffManagement/StaffRegistration'));
const AllStaffs = React.lazy(() => import('../pages/StaffManagement/AllStaffs'));
const EditStaffs = React.lazy(() => import('../pages/StaffManagement/EditStaff'));
const AllUsers = React.lazy(() => import('../pages/StaffManagement/AllUsers'));


const AllSlab= React.lazy(() => import('../pages/Master/SIPSlab'));
const AddSlab= React.lazy(() => import('../pages/Master/AddSIPSlab'));
const EditSlab= React.lazy(() => import('../pages/Master/EditSIPSlab'));

const AllSipCategory= React.lazy(() => import('../pages/Master/AllSipCategory'));
const AddSipCategory= React.lazy(() => import('../pages/Master/AddSipCategory'));
const EditSipCategory= React.lazy(() => import('../pages/Master/EditSipCategory'));

const AddMember = React.lazy(() => import('../pages/SIPManagement/Registration'));
const EditMember= React.lazy(() => import('../pages/SIPManagement/EditSIPManagement'));
const AllMember= React.lazy(() => import('../pages/SIPManagement/AllSIPManagements'));
const ImportMember= React.lazy(() => import('../pages/SIPManagement/ImportSIPMember'));


const AddPayment= React.lazy(() => import('../pages/SIPManagement/AddSIPPayment'));
const AllPayment= React.lazy(() => import('../pages/SIPManagement/PaymentReciept'));
const EditPayment= React.lazy(() => import('../pages/SIPManagement/EditSIPPayment'));


const AddLuckyDraw= React.lazy(() => import('../pages/SIPManagement/AddLuckyDraw'));
const AllLuckyDraw= React.lazy(() => import('../pages/SIPManagement/LuckyDraw'));
const EditLuckyDraw = React.lazy(() => import('../pages/SIPManagement/EditLuckyDraw'));


const AddMaturity= React.lazy(() => import('../pages/SIPManagement/AddMaturity'));
const AllMaturity= React.lazy(() => import('../pages/SIPManagement/Maturity'));
const EditMaturity = React.lazy(() => import('../pages/SIPManagement/EditMaturity'));

const PaymentReport = React.lazy(() => import('../pages/report/SIPPaymentMonthlyReport'));
const MemberPaymentReport = React.lazy(() => import('../pages/report/SIPMemberPaymentReport'));
const MemberDetailsReport = React.lazy(() => import('../pages/report/SIPMemberDetailsReport'));
const LuvkyDrawDetails = React.lazy(() => import('../pages/report/SIPLuckyDrawDetailsReport'));
const commissionReport = React.lazy(() => import('../pages/report/ClientwiseReferenceComission'));


const ChangePassword = React.lazy(() => import('../pages/StaffManagement/ChangePassword'));



const SIPSlab = React.lazy(() => import('../pages/Master/SIPSlab'));

const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const LockScreen = React.lazy(() => import('../pages/auth/LockScreen'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));

// dashboards
const DashBoard1 = React.lazy(() => import('../pages/dashboards/DashBoard1/'));

// apps
const CalendarApp = React.lazy(() => import('../pages/apps/Calendar'));
const ChatApp = React.lazy(() => import('../pages/apps/Chat'));
const Inbox = React.lazy(() => import('../pages/apps/Email/Inbox'));
const Kanban = React.lazy(() => import('../pages/apps/Tasks/Board'));
const TaskDetail = React.lazy(() => import('../pages/apps/Tasks/Detail'));
const Projects = React.lazy(() => import('../pages/apps/Projects'));
const List = React.lazy(() => import('../pages/apps/Contacts/List'));
const Profile = React.lazy(() => import('../pages/apps/Contacts/Profile'));

// extra pages
const Starter = React.lazy(() => import('../pages/other/Starter'));
const Pricing = React.lazy(() => import('../pages/other/Pricing'));
const Timeline = React.lazy(() => import('../pages/other/Timeline'));
const Invoice = React.lazy(() => import('../pages/other/Invoice'));
const FAQ = React.lazy(() => import('../pages/other/FAQ'));
const Gallery = React.lazy(() => import('../pages/other/Gallery'));
const Error404 = React.lazy(() => import('../pages/other/Error404'));
const Error500 = React.lazy(() => import('../pages/other/Error500'));
const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));
const ComingSoon = React.lazy(() => import('../pages/other/ComingSoon'));

// base ui
const Buttons = React.lazy(() => import('../pages/uikit/Buttons'));
const Cards = React.lazy(() => import('../pages/uikit/Cards'));
const Avatars = React.lazy(() => import('../pages/uikit/Avatars'));
const TabsAccordions = React.lazy(() => import('../pages/uikit/TabsAccordions'));
const Notifications = React.lazy(() => import('../pages/uikit/Notifications'));
const Modals = React.lazy(() => import('../pages/uikit/Modals'));
const Progress = React.lazy(() => import('../pages/uikit/Progress'));
const Offcanvases = React.lazy(() => import('../pages/uikit/Offcanvases'));
const Placeholders = React.lazy(() => import('../pages/uikit/Placeholders'));
const Spinners = React.lazy(() => import('../pages/uikit/Spinners'));
const Images = React.lazy(() => import('../pages/uikit/Images'));
const Carousel = React.lazy(() => import('../pages/uikit/Carousel'));
const EmbedVedio = React.lazy(() => import('../pages/uikit/EmbedVideo'));
const Dropdowns = React.lazy(() => import('../pages/uikit/Dropdowns'));
const PopoversAndTooltips = React.lazy(() => import('../pages/uikit/PopoversAndTooltips'));
const GeneralUI = React.lazy(() => import('../pages/uikit/GeneralUI'));
const Typography = React.lazy(() => import('../pages/uikit/Typography'));
const Grid = React.lazy(() => import('../pages/uikit/Grid'));

// widgets
const Widgets = React.lazy(() => import('../pages/uikit/Widgets'));

// extended ui
const RangeSliders = React.lazy(() => import('../pages/uikit/RangeSlider'));
const NestableList = React.lazy(() => import('../pages/uikit/NestableList'));
const SweetAlerts = React.lazy(() => import('../pages/uikit/SweetAlerts'));
const Tourpage = React.lazy(() => import('../pages/uikit/TourPage'));
const TreeViewExample = React.lazy(() => import('../pages/uikit/TreeView'));

// icons
const FeatherIcons = React.lazy(() => import('../pages/icons/FeatherIcons'));
const MDIIcons = React.lazy(() => import('../pages/icons/MDIIcons'));
const Dripicons = React.lazy(() => import('../pages/icons/DripiIcons'));
const FontAwesomeIcons = React.lazy(() => import('../pages/icons/FontAwesomeIcons'));
const ThemifyIcons = React.lazy(() => import('../pages/icons/ThemifyIcons'));

// forms
const GeneralElements = React.lazy(() => import('../pages/forms/Basic'));
const FormAdvanced = React.lazy(() => import('../pages/forms/Advanced'));
const Validation = React.lazy(() => import('../pages/forms/Validation'));
const FormWizard = React.lazy(() => import('../pages/forms/Wizard'));
const FileUpload = React.lazy(() => import('../pages/forms/FileUpload'));
const Editors = React.lazy(() => import('../pages/forms/Editors'));

// tables
const BasicTable = React.lazy(() => import('../pages/tables/BasicTable'));
const AdvancedTable = React.lazy(() => import('../pages/tables/AdvancedTable'));

// charts
const ApexChart = React.lazy(() => import('../pages/chart/ApexChart'));
const ChartJs = React.lazy(() => import('../pages/chart/ChartJs'));

// maps
const GoogleMaps = React.lazy(() => import('../pages/maps/GoogleMaps'));
const VectorMaps = React.lazy(() => import('../pages/maps/VectorMaps'));

// lamding
const Landing = React.lazy(() => import('../pages/Landing'));


const loading = () => <div className=""></div>;

type LoadComponentProps = {
  component: React.LazyExoticComponent<() => JSX.Element>;
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
  <Suspense fallback={loading()}>
    <Component />
  </Suspense>
);

const AllRoutes = () => {
  const { appSelector } = useRedux();

  const { layout } = appSelector((state) => ({
    layout: state.Layout,
  }));

  const getLayout = () => {
    let layoutCls: React.ComponentType = VerticalLayout;

    switch (layout.layoutType) {
      case LayoutTypes.LAYOUT_HORIZONTAL:
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  };
  let Layout = getLayout();

  return useRoutes([
    { path: '/', element: <Root /> },
    {
      // public routes
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          path: 'auth',
          children: [
            { path: 'login', element: <LoadComponent component={Login} /> },
            { path: 'register', element: <LoadComponent component={Register} /> },
            { path: 'confirm', element: <LoadComponent component={Confirm} /> },
            { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
            { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
            { path: 'logout', element: <LoadComponent component={Logout} /> },
          ],
        },
        {
          path: 'error-404',
          element: <LoadComponent component={Error404} />,
        },
        {
          path: 'error-500',
          element: <LoadComponent component={Error500} />,
        },
        {
          path: 'maintenance',
          element: <LoadComponent component={Maintenance} />,
        },
        {
          path: 'coming-soon',
          element: <LoadComponent component={ComingSoon} />,
        },
        {
          path: 'landing',
          element: <LoadComponent component={Landing} />,
        },
      ],
    },
    {
      // auth protected routes
      path: '/',
      element: <PrivateRoute roles={'Admin'} component={Layout} />,
      children: [
        {
          path: 'dashboard',
          element: <LoadComponent component={DashBoard1} />,
        },
        {
          path: 'branch',
          element: <LoadComponent component={Branch} />,
        },
        {
          path: 'add-branch',
          element: <LoadComponent component={AddBranch} />,
        },
        {
          path: 'department',
          element: <LoadComponent component={Department} />,
        },
        {
          path: 'add-department',
          element: <LoadComponent component={AddDepartment} />,
        },
        {
          path: 'designation',
          element: <LoadComponent component={Designation} />,
        },
        {
          path: 'add-designation',
          element: <LoadComponent component={AddDesignation} />,
        },
        // {
        //   path: 'sipslab',
        //   element: <LoadComponent component={SIPSlab} />,
        // },
        {
          path: 'client-registration',
          element: <LoadComponent component={ClientRegistration} />,
        },
        {
          path: 'clients',
          element: <LoadComponent component={AllClients} />,
        },
        {
          path: 'importclient',
          element: <LoadComponent component={ImportClient} />,
        },
        {
          path: 'edit-client/:id',
          element: <LoadComponent component={EditClient} />,
        },
        {
          path: `edit-branch/:id`,
          element: <LoadComponent component={EditBranch} />,
        },
        {
          path: 'edit-designation/:id',
          element: <LoadComponent component={EditDesignation} />,
        },
        {
          path: 'edit-department/:id',
          element: <LoadComponent component={EditDepartment} />,
        },
        {
          path: 'add-staff',
          element: <LoadComponent component={AddStaff} />,
        },
        {
          path: 'staff',
          element: <LoadComponent component={AllStaffs} />,
        },
        {
          path: 'edit-staff/:id',
          element: <LoadComponent component={EditStaffs} />,
        },
        {
          path: 'add-slab',
          element: <LoadComponent component={AddSlab} />,
        },
        {
          path: 'sipslab',
          element: <LoadComponent component={AllSlab} />,
        },
        {
          path: 'edit-slab/:id',
          element: <LoadComponent component={EditSlab} />,
        },
        {
          path: 'sipcategory',
          element: <LoadComponent component={AllSipCategory} />,
        },
        {
          path: 'add-sipcategory',
          element: <LoadComponent component={AddSipCategory} />,
        },
        {
          path: 'edit-sipcategory/:id',
          element: <LoadComponent component={EditSipCategory} />,
        },
        {
          path: 'add-sipmember',
          element: <LoadComponent component={AddMember} />,
        },
        {
          path: 'all-sipmember',
          element: <LoadComponent component={AllMember} />,
        },
        {
          path: 'edit-sipmember/:id',
          element: <LoadComponent component={EditMember} />,
        },
        {
          path: 'importmember',
          element: <LoadComponent component={ImportMember} />,
        },
        {
          path: 'add-payment',
          element: <LoadComponent component={AddPayment} />,
        },
        {
          path: 'all-payement',
          element: <LoadComponent component={AllPayment} />,
        },
        {
          path: 'edit-payment/:id',
          element: <LoadComponent component={EditPayment} />,
        },
        {
          path: 'all-luckydraw',
          element: <LoadComponent component={AllLuckyDraw} />,
        },
        {
          path: 'add-luckydraw',
          element: <LoadComponent component={AddLuckyDraw} />,
        },
        {
          path: 'edit-luckydraw/:id',
          element: <LoadComponent component={EditLuckyDraw} />,
        },
        {
          path: 'add-maturity',
          element: <LoadComponent component={AddMaturity} />,
        },
        {
          path: 'all-maturity',
          element: <LoadComponent component={AllMaturity} />,
        },
        {
          path: 'edit-maturity/:id',
          element: <LoadComponent component={EditMaturity} />,
        },
        {
          path: 'users',
          element: <LoadComponent component={AllUsers} />,
        },
        {
          path: 'payment-report',
          element: <LoadComponent component={PaymentReport} />,
        },
        {
          path: 'memberpayment-report',
          element: <LoadComponent component={MemberPaymentReport} />,
        },
        {
          path: 'memberdetails-report',
          element: <LoadComponent component={MemberDetailsReport} />,
        },
        {
          path: 'changepassword',
          element: <LoadComponent component={ChangePassword} />,
        },
        {
          path: 'luckydraw-report',
          element: <LoadComponent component={LuvkyDrawDetails} />,
        },
        {
          path: 'comission-report',
          element: <LoadComponent component={commissionReport} />,
        },
        {
          path: 'add-referencelevel',
          element: <LoadComponent component={AddReferenceLevel} />,
        },
        {
          path: 'all-referencelevel',
          element: <LoadComponent component={AllReferenceLevel} />,
        },
        {
          path: 'edit-referencelevel/:id',
          element: <LoadComponent component={EditReferenceLevel} />,
        },
        {
          path: 'add-refschpayment',
          element: <LoadComponent component={AddRefSchPayment} />,
        },
        {
          path: 'all-refschpayment',
          element: <LoadComponent component={AllRefSchPayment} />,
        },
        {
          path: 'edit-refschpayment/:id',
          element: <LoadComponent component={EditRefSchPayment} />,
        },
        {
          path: 'apps',
          children: [
            {
              path: 'calendar',
              element: <LoadComponent component={CalendarApp} />,
            },
            {
              path: 'chat',
              element: <LoadComponent component={ChatApp} />,
            },
            {
              path: 'email/inbox',
              element: <LoadComponent component={Inbox} />,
            },
            {
              path: 'tasks/kanban',
              element: <LoadComponent component={Kanban} />,
            },
            {
              path: 'tasks/details',
              element: <LoadComponent component={TaskDetail} />,
            },
            {
              path: 'projects',
              element: <LoadComponent component={Projects} />,
            },
            {
              path: 'contacts/list',
              element: <LoadComponent component={List} />,
            },
            {
              path: 'contacts/profile',
              element: <LoadComponent component={Profile} />,
            },
          ],
        },
        {
          path: 'pages',
          children: [
            {
              path: 'starter',
              element: <LoadComponent component={Starter} />,
            },
            {
              path: 'pricing',
              element: <LoadComponent component={Pricing} />,
            },
            {
              path: 'timeline',
              element: <LoadComponent component={Timeline} />,
            },
            {
              path: 'invoice',
              element: <LoadComponent component={Invoice} />,
            },
            {
              path: 'faq',
              element: <LoadComponent component={FAQ} />,
            },
            {
              path: 'gallery',
              element: <LoadComponent component={Gallery} />,
            },
          ],
        },
        {
          path: 'base-ui',
          children: [
            {
              path: 'buttons',
              element: <LoadComponent component={Buttons} />,
            },
            {
              path: 'cards',
              element: <LoadComponent component={Cards} />,
            },
            {
              path: 'avatars',
              element: <LoadComponent component={Avatars} />,
            },
            {
              path: 'tabs-accordions',
              element: <LoadComponent component={TabsAccordions} />,
            },
            {
              path: 'notifications',
              element: <LoadComponent component={Notifications} />,
            },
            {
              path: 'modals',
              element: <LoadComponent component={Modals} />,
            },
            {
              path: 'progress',
              element: <LoadComponent component={Progress} />,
            },
            {
              path: 'offcanvas',
              element: <LoadComponent component={Offcanvases} />,
            },
            {
              path: 'placeholders',
              element: <LoadComponent component={Placeholders} />,
            },
            {
              path: 'spinners',
              element: <LoadComponent component={Spinners} />,
            },
            {
              path: 'images',
              element: <LoadComponent component={Images} />,
            },
            {
              path: 'carousel',
              element: <LoadComponent component={Carousel} />,
            },
            {
              path: 'embedvideo',
              element: <LoadComponent component={EmbedVedio} />,
            },
            {
              path: 'dropdowns',
              element: <LoadComponent component={Dropdowns} />,
            },
            {
              path: 'popovers-tooltips',
              element: <LoadComponent component={PopoversAndTooltips} />,
            },
            {
              path: 'general',
              element: <LoadComponent component={GeneralUI} />,
            },
            {
              path: 'typography',
              element: <LoadComponent component={Typography} />,
            },
            {
              path: 'grid',
              element: <LoadComponent component={Grid} />,
            },
          ],
        },
        {
          path: 'widgets',
          element: <LoadComponent component={Widgets} />,
        },
        {
          path: 'extended-ui',
          children: [
            {
              path: 'nestable',
              element: <LoadComponent component={NestableList} />,
            },
            {
              path: 'rangesliders',
              element: <LoadComponent component={RangeSliders} />,
            },
            {
              path: 'sweet-alert',
              element: <LoadComponent component={SweetAlerts} />,
            },
            {
              path: 'tour',
              element: <LoadComponent component={Tourpage} />,
            },
            {
              path: 'treeview',
              element: <LoadComponent component={TreeViewExample} />,
            },
          ],
        },
        {
          path: 'icons',
          children: [
            {
              path: 'feather',
              element: <LoadComponent component={FeatherIcons} />,
            },
            {
              path: 'mdi',
              element: <LoadComponent component={MDIIcons} />,
            },
            {
              path: 'dripicons',
              element: <LoadComponent component={Dripicons} />,
            },
            {
              path: 'font-awesome',
              element: <LoadComponent component={FontAwesomeIcons} />,
            },
            {
              path: 'themify',
              element: <LoadComponent component={ThemifyIcons} />,
            },
          ],
        },
        {
          path: 'forms',
          children: [
            {
              path: 'basic',
              element: <LoadComponent component={GeneralElements} />,
            },
            {
              path: 'advanced',
              element: <LoadComponent component={FormAdvanced} />,
            },
            {
              path: 'validation',
              element: <LoadComponent component={Validation} />,
            },
            {
              path: 'wizard',
              element: <LoadComponent component={FormWizard} />,
            },
            {
              path: 'upload',
              element: <LoadComponent component={FileUpload} />,
            },
            {
              path: 'editors',
              element: <LoadComponent component={Editors} />,
            },
          ],
        },
        {
          path: 'tables',
          children: [
            {
              path: 'basic',
              element: <LoadComponent component={BasicTable} />,
            },
            {
              path: 'advanced',
              element: <LoadComponent component={AdvancedTable} />,
            },
          ],
        },
        {
          path: 'charts',
          children: [
            {
              path: 'apex',
              element: <LoadComponent component={ApexChart} />,
            },
            {
              path: 'chartjs',
              element: <LoadComponent component={ChartJs} />,
            },
          ],
        },
        {
          path: 'maps',
          children: [
            {
              path: 'google',
              element: <LoadComponent component={GoogleMaps} />,
            },
            {
              path: 'vector',
              element: <LoadComponent component={VectorMaps} />,
            },
          ],
        },
      ],
    },
  ]);
};

export { AllRoutes };
