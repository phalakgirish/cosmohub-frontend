import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Row, Col, Container, Card, Button, Modal } from 'react-bootstrap';
import url from '../../env';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


interface IFormInput {
    fullname: string;
    email: string;
    staff_isemailVerified:string;
    dob: string;
    country: string;
    state: string;
    // city: string;
    phone_code: string;
    mobile_number: string;
    gender: string;
    pancard: FileList;
    aadharcard: FileList;
    department: string;
    designation: string;
    branch: string;
    doj: string;
    checkboxsignup: boolean;
    role:string;
}

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Define the type for department data
type Department = {
    _id: string;
    department_name: string;
};

type Country = {
    _id: string;
    country_name: string;
    country_code: string;
    country_phonecode: string;
};

type State = {
    _id: string;
    state_name: string;
    state_code: string;
    state_country: string;
};

type Designation = {
    _id: string;
    designation_name: string;
};

const StaffRegistration = () => {
    const [staffPancard, setStaffPancard] = useState({});
    const [staffAadharcard, setStaffAadharcard] = useState({});
    const[aadharFileStatus,setAadharFileStatus] = useState(false);
    const[panFileStatus,setPanFileStatus] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designation, setDesignation] = useState<Designation[]>([]);
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [otp,setOtp] = useState(0)
    const [userOtp,setUserOtp] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [otpErr,setOtpErr] = useState('')
    const [isOtpErr,setIsOtpErr] = useState(false)

    const navigate = useNavigate();

    const[errFile,setErrFile] = useState(false);
    const[fileName,setFileName] = useState('')

    usePageTitle({
        title: 'Add Staff',
        breadCrumbItems: [
            {
                path: '/forms/validation',
                label: 'Forms',
            },
            {
                path: '/forms/validation',
                label: 'Validation',
                active: true,
            },
        ],
    });

    const schema = yup.object().shape({
        fullname: yup.string().required('Please enter Fullname'),
        email: yup.string().required('Please enter Email').email('Please enter a valid Email'),
        // password: yup.string().required('Please enter Password'),
        dob: yup.string().required('Please enter Date of Birth')
        .test('is-at-least-one-year-back', 'Staff must be at least 18 year old.', (value) => {
            if (!value) return false;

            const dob = new Date(value);
            const today = new Date();
            const oneYearAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            return dob <= oneYearAgo;
        }),
        mobile_number: yup.string().required('Please enter Mobile Number'),
        gender: yup.string().required('Please select Gender'),
        pancard: yup.mixed().required('Please upload PAN Card'),
        aadharcard: yup.mixed().required('Please upload Aadhar Card'),
        department: yup.string().required('Please enter Department'),
        designation: yup.string().required('Please enter Designation'),
        branch: yup.string().required('Please enter Branch'),
        doj: yup.string().required('Please enter Date of Joining'),
        checkboxsignup: yup.bool().oneOf([true], 'Must accept Terms and Conditions'),
        role: yup.string().required('Please select staff role'),
        country: yup.string().required('Please select country'),
        state: yup.string().required('Please select state'),
        // city: yup.string().required('Please enter city/village')
    });

    useEffect(() => {
        // Fetch branches from the backend
        const fetchBranches = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/branch/all/all`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                
                if (response.ok) {
                    setBranches(data.branch || []);
                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchBranches();

        const fetchCountries = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/all/country`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                // console.log(data);
                
                if (response.ok) {
                    setCountries(data.country || []);
                } else {
                    console.error('Error fetching countries:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchCountries();
    }, []);

    const { register, handleSubmit, formState: { errors },setValue } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    const handleVerifyCancel = () => {
        setShowModal(false);
        // setSelectedStaffId(null);
    };

    const handleVerifyOpen = () => {
        setShowModal(true);
    };

    const handelotpchange = (otpno:any)=>{
        if(otpno == '')
        {
            setOtpErr('Please Enter OTP.');
            setIsOtpErr(true);
        }
        else
        {
            setOtpErr('');
            setIsOtpErr(false);
            setUserOtp(parseInt(otpno))
        }
    }

    const handleOTPConfirm = async () => {


        if(userOtp != 0)
        {
            if(otp == userOtp)
            {
                setIsEmailVerified(true)
                handleVerifyCancel();
            }
            else
            {
                setOtpErr('Please Enter valid OTP.');
                setIsOtpErr(true);
            }
        }
        else
        {
            setOtpErr('Please Enter OTP.');
            setIsOtpErr(true);
        }
        
    };

    const handelVerifyEmail = async (emailId:any)=>{
        // console.log(emailId);

        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/staff/verify/${emailId}`,{
                method:'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                    }
            });
            const data = await response.json();
            // console.log(data);
            
            if (response.ok) {
                // setDesignation(data.designation || []);
                // console.log(data);
                
                setOtp(data.otp);
                handleVerifyOpen();
            } else {
                console.error('Error fetching otp:', data);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
        
    }

    const handlepancardChange = (e:any)=>{
        // console.log(e.target.files);
        if(e.target.files[0] === undefined || e.target.files[0] === null)
        {
            setPanFileStatus(false);
            setErrFile(true);
            setFileName('pancard')
            
        }
        else
        {
            setPanFileStatus(true);
            setErrFile(false);
            setStaffPancard(e.target.files[0])
        }
    }

    const handleadddharcardChange = (e:any)=>{
        if(e.target.files[0] === undefined || e.target.files[0] === null)
            {
                setAadharFileStatus(false);
                setErrFile(true);
                setFileName('aadharcard')
                
            }
            else
            {
                setAadharFileStatus(true);
                setErrFile(false);
                setStaffAadharcard(e.target.files[0])
            }
    }

    const onSubmit = async (data: IFormInput) => {
        console.log(data);
        
        if(!panFileStatus)
        {
            setErrFile(true);
            setFileName('pancard')
            // console.log(errFile);
        }
        else if(!aadharFileStatus)
        {
            setErrFile(true);
            setFileName('aadharcard')
            // console.log(errFile);
        }
        else
        {
            // console.log(data);
            
            const formData = new FormData();
            formData.append('staff_name', data.fullname);
            formData.append('staff_dob', data.dob);
            formData.append('staff_mobile_number', `${data.phone_code}-${data.mobile_number}`);
            formData.append('staff_emailId', data.email);
            formData.append('staff_isemailVerified', isEmailVerified.toString());
            formData.append('staff_gender', data.gender);
            formData.append('staff_pancard', data.pancard[0]);
            formData.append('staff_addharcard', data.aadharcard[0]);
            formData.append('staff_department', data.department);
            formData.append('staff_designation', data.designation);
            formData.append('staff_branch', data.branch);
            formData.append('staff_doj', data.doj);
            formData.append('staff_role_type', data.role);
            formData.append('staff_country', data.country);
            formData.append('staff_state', data.state);


            // console.log(formData);
            

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/staff`, {
                    body: formData,
                    method: 'POST',
                    headers: {
                        // 'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    
                });
                const result = await response.json();
                if(response.ok)
                {
                    // console.log('Registration successful:', result);
                    var toasterMessage = `${result.message}, User email Id: ${result.usesCreatedData.staff_email_id} and Password: ${result.usesCreatedData.password}`
                    toast.success( toasterMessage || 'Staff added successfully');
                    navigate('/staff')
                }
                else
                {
                    toast.error(result.message || 'Failed to add Staff.');
                }
                
            } catch (error) {
                // console.error('Error during registration:', error);
                toast.error(`Error during registration:${error}`);

            }
        }
        
    };

    const handleCountryChange = async (country:any)=>{

        if(country != '')
        {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/all/state/${country}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                // console.log(data);
                
                if (response.ok) {
                    setStates(data.states || []);
                } else {
                    console.error('Error fetching states:', data);
                }
                var phoneCode = countries.filter((item:any)=> item.country_name === country);

                setValue('phone_code',phoneCode[0].country_phonecode)
            } catch (error) {
                console.error('Error during API call:', error);
            }
        }
        else
        {
            setValue('phone_code','');
            setStates([]);

        }
        
    }

    const handleBranchChange = async (e:any)=>{
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/all/department/${e.target.value}`,{
                method:'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                    }
            });
            const data = await response.json();
            // console.log(data);
            
            if (response.ok) {
                setDepartments(data.department || []);
            } else {
                console.error('Error fetching department:', data);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    }

    const handleDepartmentChange = async (e:any)=>{
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/all/designation/${e.target.value}`,{
                method:'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                    }
            });
            const data = await response.json();
            // console.log(data);
            
            if (response.ok) {
                setDesignation(data.designation || []);
            } else {
                console.error('Error fetching department:', data);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col>
                    <Card className="mt-4">
                        <Card.Body>
                            <div className='d-flex'>
                                <div>
                                <h4 className="header-title mt-0 mb-1">Add Staff</h4>
                                <p className="sub-header">Fill the form to add a new Staff.</p>
                                </div>
                                <div className="text-md-end mb-0" style={{width:'83%'}}>
                                    <Button variant="dark" type="reset" onClick={()=>{navigate('/staff')}}>
                                        Back
                                    </Button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="fullname" className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                id="fullname"
                                                placeholder="Enter Full Name"
                                                className="form-control"
                                                {...register('fullname')}
                                            />
                                            {errors.fullname && <div className="invalid-feedback d-block">{errors.fullname.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <div className='d-flex'>
                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="Enter Email"
                                                className="form-control"
                                                {...register('email')}
                                                disabled = {(isEmailVerified)?true:false}
                                                onBlur={async(e)=>{await handelVerifyEmail(e.target.value)}}
                                                style={{width:'87%'}}
                                            />{(isEmailVerified)?<span className="badge badge-soft-success pt-2" style={{width:'13%',fontSize: '85%'}}>Verified</span>:<span className="badge badge-soft-danger pt-2" style={{width:'13%',fontSize: '85%'}}>Unverified</span>}
                                            </div>
                                            {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
                                        </div>

                                        {/* <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                id="password"
                                                placeholder="Enter Password"
                                                className="form-control"
                                                {...register('password')}
                                            />
                                            {/* {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>} 
                                        </div> */}

                                        <div className="mb-3">
                                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                                            <input
                                                type="date"
                                                id="dob"
                                                className="form-control"
                                                {...register('dob')}
                                            />
                                            {errors.dob && <div className="invalid-feedback d-block">{errors.dob.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                                            <div className="d-flex">
                                                <input
                                                    type="text"
                                                    id="phone_code"
                                                    placeholder="phone code"
                                                    className="form-control"
                                                    {...register('phone_code')}
                                                    disabled
                                                    style={{width:'10%'}}
                                                />
                                                <input
                                                    type="text"
                                                    id="mobile_number"
                                                    placeholder="Enter Mobile Number"
                                                    className="form-control"
                                                    {...register('mobile_number')}
                                                    style={{width:'90%'}}
                                                />
                                            </div>
                                            {errors.mobile_number && <div className="invalid-feedback d-block">{errors.mobile_number.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="gender" className="form-label">Gender</label>
                                            <select
                                                id="gender"
                                                className="form-control"
                                                {...register('gender')}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <select
                                                id="role"
                                                className="form-control"
                                                {...register('role')}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="1">Admin</option>
                                                <option value="2">Staff</option>
                                            </select>
                                            {errors.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="doj" className="form-label">Date of Joining</label>
                                            <input
                                                type="date"
                                                id="doj"
                                                className="form-control"
                                                {...register('doj')}
                                            />
                                            {errors.doj && <div className="invalid-feedback d-block">{errors.doj.message}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="pancard" className="form-label">PAN Card</label>
                                            <input
                                                type="file"
                                                id="pancard"
                                                className="form-control"
                                                {...register('pancard')}
                                                onChange={(e)=>{handlepancardChange(e)}}
                                            />
                                            {/* {errors.pancard && <div className="invalid-feedback d-block">{errors.pancard.message}</div>} */}
                                            {(errFile && fileName == 'pancard')?(<div className="invalid-feedback d-block">Please upload PAN Card</div>):''}

                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="aadharcard" className="form-label">Aadhar Card</label>
                                            <input
                                                type="file"
                                                id="aadharcard"
                                                className="form-control"
                                                {...register('aadharcard')}
                                                onChange={(e)=>{handleadddharcardChange(e)}}

                                            />
                                            {/* {errors.aadharcard && <div className="invalid-feedback d-block">{errors.aadharcard.message}</div>} */}
                                            {(errFile && fileName == 'aadharcard')?(<div className="invalid-feedback d-block">Please upload Aadhar Card</div>):''}
                                        </div>

                                         <div className="mb-3">
                                            <label htmlFor="country" className="form-label">Country</label>

                                            <select {...register("country", {required:true})} className="form-control" id="country" onChange={(e)=>{handleCountryChange(e.target.value)}}>
                                                    <option value="">-- Select --</option>

                                                    {countries.map((country) => (
                                                        <option key={country.country_name} value={country.country_name}>
                                                           {country.country_name} - {country.country_code}
                                                        </option>
                                                        ))}
                                                </select>
                                            {errors.country && <div className="invalid-feedback d-block">{errors.country.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="state" className="form-label">State</label>

                                            <select {...register("state", {required:true})} className="form-control" id="state">
                                                    <option value="">-- Select --</option>

                                                    {states.map((state) => (
                                                        <option key={state.state_name} value={state.state_name}>
                                                           {state.state_name} - {state.state_code}
                                                        </option>
                                                        ))}
                                                </select>
                                            {errors.state && <div className="invalid-feedback d-block">{errors.state.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="branch" className="form-label">Branch</label>

                                            <select {...register("branch", {required:true})} className="form-control" id="branch" onChange={(e)=>{handleBranchChange(e)}}>
                                                    <option value="">-- Select --</option>

                                                    {branches.map((branch) => (
                                                        <option key={branch._id} value={branch._id}>
                                                            {branch.branch_name}
                                                        </option>
                                                        ))}
                                                </select>
                                            {errors.branch && <div className="invalid-feedback d-block">{errors.branch.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="department" className="form-label">Department</label>
                                            <select {...register("department", {required:true})} className="form-control" id="branch" onChange={(e)=>{handleDepartmentChange(e)}}>
                                                    <option value="">-- Select --</option>

                                                    {departments.map((departments) => (
                                                        <option key={departments._id} value={departments._id}>
                                                            {departments.department_name}
                                                        </option>
                                                        ))}
                                            </select>
                                            {errors.department && <div className="invalid-feedback d-block">{errors.department.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="designation" className="form-label">Designation</label>
                                             <select {...register("designation", {required:true})} className="form-control" id="designation" >
                                                    <option value="">-- Select --</option>

                                                    {designation.map((designation) => (
                                                        <option key={designation._id} value={designation._id}>
                                                            {designation.designation_name}
                                                        </option>
                                                        ))}
                                            </select>
                                            {errors.designation && <div className="invalid-feedback d-block">{errors.designation.message}</div>}
                                        </div>
                                    </Col>
                                </Row>

                                <div className="text-md-end mb-0">
                                    <Button variant="primary" className="me-1" type="submit">
                                        Submit
                                    </Button>
                                    <Button variant="secondary" type="reset">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>

            <Modal show={showModal} onHide={handleVerifyCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Verify OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="OTP" className="form-label">Enter OTP For Verification</label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="Enter OTP"
                                className="form-control"
                                onChange={(e)=>{handelotpchange(e.target.value)}}
                            />
                            {(isOtpErr) && <div className="invalid-feedback d-block">{otpErr}</div>}
                    </div></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleVerifyCancel}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleOTPConfirm}>
                        Verify
                    </Button>
                </Modal.Footer>
            </Modal>
            </Row>
        </Container>
    );
};

export default StaffRegistration;