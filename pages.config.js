import BrightMLS from './pages/BrightMLS';
import CMABuilder from './pages/CMABuilder';
import Calendar from './pages/Calendar';
import ClientDetail from './pages/ClientDetail';
import Clients from './pages/Clients';
import Dashboard from './pages/Dashboard';
import DocuSigning from './pages/DocuSigning';
import DocumentEditor from './pages/DocumentEditor';
import Documents from './pages/Documents';
import Expenses from './pages/Expenses';
import FillInterview from './pages/FillInterview';
import GoogleDocsIntegration from './pages/GoogleDocsIntegration';
import Home from './pages/Home';
import InterviewBuilder from './pages/InterviewBuilder';
import InterviewTemplates from './pages/InterviewTemplates';
import Messages from './pages/Messages';
import PDFViewer from './pages/PDFViewer';
import Passwords from './pages/Passwords';
import Pipeline from './pages/Pipeline';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Settings from './pages/Settings';
import SettlementSheet from './pages/SettlementSheet';
import SignDocument from './pages/SignDocument';
import TVDashboard from './pages/TVDashboard';
import Tasks from './pages/Tasks';
import TemplateDetail from './pages/TemplateDetail';
import Templates from './pages/Templates';
import ZipForm from './pages/ZipForm';
import ContactCardGenerator from './pages/ContactCardGenerator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BrightMLS": BrightMLS,
    "CMABuilder": CMABuilder,
    "Calendar": Calendar,
    "ClientDetail": ClientDetail,
    "Clients": Clients,
    "Dashboard": Dashboard,
    "DocuSigning": DocuSigning,
    "DocumentEditor": DocumentEditor,
    "Documents": Documents,
    "Expenses": Expenses,
    "FillInterview": FillInterview,
    "GoogleDocsIntegration": GoogleDocsIntegration,
    "Home": Home,
    "InterviewBuilder": InterviewBuilder,
    "InterviewTemplates": InterviewTemplates,
    "Messages": Messages,
    "PDFViewer": PDFViewer,
    "Passwords": Passwords,
    "Pipeline": Pipeline,
    "Properties": Properties,
    "PropertyDetail": PropertyDetail,
    "Settings": Settings,
    "SettlementSheet": SettlementSheet,
    "SignDocument": SignDocument,
    "TVDashboard": TVDashboard,
    "Tasks": Tasks,
    "TemplateDetail": TemplateDetail,
    "Templates": Templates,
    "ZipForm": ZipForm,
    "ContactCardGenerator": ContactCardGenerator,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};
