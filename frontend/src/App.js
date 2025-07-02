import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbarr from './components/Navbarr';
import CampRegistration from './components/CampRegistration';
import AdminDashboard from './components/AdminDashboard';
import CampOfficerRegistration from './components/CampOfficerRegstration';
import MedicalOfficerRegistration from './components/MedicalOfficerRegistration';
import AddCategory from './components/AddCateogry';
import CategoryRegistration from './components/CategoryRegistration';
import ManageCamps from './components/ManageCamps';
import CampSummary from './components/CampSummary';
import Inventory from "./components/Inventory"
import CampOfficerDashboard from './components/COfficerDashboard';
import HomePage from './components/Home';
import Login from './components/Login';
import ViewCampOfficer from './components/Viewcofficer';
import ViewMedicalOfficer from './components/viewmedicalofficer';
import DonationSlip from './components/Donation';
import Clogin from './components/clogin';
import AssignCOfficer from './components/AssignCOfficer';
import CoNavbar from './components/CoNavbar';
import Logout from './components/Logout';
import VictimRegistration from './components/VictimReg';
import VictimList from './components/VictimList';
import UpdateVictimStatus from './components/UpdateVictimStatus';
import VolunteerRegistration from './components/VolunteerReg';
import VolunteerLogin from './components/VolunteerLogin';
import CampOfficerVolunteers from './components/VolunteersCamp';
import VolunteerDashboard from './components/VolunteerDashboard';
import VolunteerNavbar from './components/VNavbar';
import CampStatus from './components/CampStatus';
import RequestSupplies from './components/RequestSupply';
import ApprovedVolunteers from './components/ApprovedVolunteers';
import Requests from './components/Requests';
import MedicalOfficerDashboard from './components/MOfficerDashboard';
import MoNavbar from './components/Mnavbar';
import AssignMOfficer from './components/AssignMOfficer';
import MedicalReport from './components/MedicalReport';
import RequestMedicalSupplies from './components/RequestMedicalSupplies';
import ViewDonations from './components/ViewDonation';
import PublicView from './components/Publicview';
import IncidentReports from './components/IncidentReport';
import AdminIncidentPanel from './components/AdminIncident';
import VictimHealthStatusPage from './components/VictimStatus';
import MedicalReportPage from './components/MedicalReportPage';
import CampReports from './components/CampDailyAdmin';
import VictimsOverview from './components/VictimsOverview';
import AdminItemsByCategory from './components/AdminItems';
import AdminEmailPage from './components/AlertPage';
import MarkCoordinates from './components/MarkCoordinates';
import LocationManager from './components/LocationManager';
import ForgotPassword from './components/ForgotPassword';


function App() {
  return (
    <div className="App">

    <BrowserRouter>
    
    <Routes>


    <Route path='/' element={<HomePage/>}/>


      <Route path='/Navbarr' element={<Navbarr/>}/>
      <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
      <Route path='/CampRegistration' element={<CampRegistration/>}/>
      <Route path='/CampOfficerRegistration' element={<CampOfficerRegistration/>}/>
      <Route path='/MedicalOfficerRegistration' element={<MedicalOfficerRegistration />} />
      <Route path="/AddCategory" element={<AddCategory />} />
      <Route path="/CateogoryRegistration" element={<CategoryRegistration />} />
      <Route path="/ManageCamps" element={<ManageCamps />} />
      <Route path="/CampSummary" element={<CampSummary />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/ApprovedVolunteers" element={<ApprovedVolunteers />} /> 
      <Route path="/Requests" element={<Requests/>} /> 
      <Route path="/adminincidents" element={<AdminIncidentPanel/>} />
      <Route path="/campreports" element={<CampReports />} />
      <Route path="/victims" element={<VictimsOverview />} />
      <Route path="/viewItems" element={<AdminItemsByCategory/>} />
      <Route path="/alerts" element={<AdminEmailPage/>} />


      <Route path="/logout" element={<Logout/>}/>

      <Route path='/CoNavbar' element={<CoNavbar/>}/>
      <Route path="/COfficerDashboard" element={<CampOfficerDashboard/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/viewcampofficer" element={<ViewCampOfficer/>}/>
      <Route path="/viewmedicalofficer" element={<ViewMedicalOfficer/>}/>
      <Route path="/donate" element={<DonationSlip/>}/>
      <Route path="/clogin" element={<Clogin/>}/>
      <Route path="/assigncofficer/:officerId" element={<AssignCOfficer/>}/>
      <Route path="/campstatus" element={<CampStatus />} />
      <Route path="/requestsupplies" element={<RequestSupplies/>} />
      <Route path="/ireports" element={<IncidentReports/>} />



      <Route path="/medicalDashboard" element={<MedicalOfficerDashboard />} />
      <Route path='/MoNavbar' element={<MoNavbar/>}/>
      <Route path="/assignmofficer/:officerId" element={<AssignMOfficer/>}/>
      <Route path='/medicalreports' element={<MedicalReport/>}/>
      <Route path='/requestMedicalSupplies' element={<RequestMedicalSupplies/>}/>
      <Route path="/healthstatus" element={<VictimHealthStatusPage />} />
      <Route path="/generateReports" element={<MedicalReportPage />} />
      


      <Route path="/victimsreg" element={<VictimRegistration/>}/>
      <Route path="/victimlist" element={<VictimList/>}/>
      <Route path="/UpdateVictimStatus" element={<UpdateVictimStatus />} />

      <Route path="/VolunteerReg" element={<VolunteerRegistration/>} />
      <Route path="/VolunteerLogin" element={<VolunteerLogin/>} />
      <Route path="/VolunteerCamp" element={<CampOfficerVolunteers/>} />
      <Route path="/VolunteerDashboard" element={<VolunteerDashboard/>} />
      <Route path="/VolunteerNavbar" element={<VolunteerNavbar/>} />
      <Route path="/Viewdonation" element={<ViewDonations/>} />
      <Route path="/publicview" element={<PublicView/>} />


      <Route path="/markcoords" element={<MarkCoordinates/>} />
      <Route path="/disaster-info" element={<LocationManager/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      
    </Routes>
    
    
    </BrowserRouter>
    </div>
  );
}

export default App;
