import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import url from '../../env';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate, useParams } from 'react-router-dom';
import { log } from 'console';

interface IFormInput {
    staff_id:string
    fullname: string;
    email: string;
    password: string;
    dob: string;
    mobile_number: string;
    gender: string;
    pancard: FileList | string;
    aadharcard: FileList | string;
    department: string;
    designation: string;
    branch: string;
    doj: string;
    checkboxsignup: boolean;
    role: string;
}

type Branch = {
    _id: string;
    branch_name: string;
};

type Department = {
    _id: string;
    department_name: string;
};

type Designation = {
    _id: string;
    designation_name: string;
};

const EditStaff = () => {
    const { id } = useParams<{ id: string }>();
    const [staffPancard, setStaffPancard] = useState<string | {}>({});
    const [staffAadharcard, setStaffAadharcard] = useState<string | {}>({});
    const [aadharFileStatus, setAadharFileStatus] = useState(false);
    const [panFileStatus, setPanFileStatus] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designation, setDesignation] = useState<Designation[]>([]);
    const navigate = useNavigate();
    const [errFile, setErrFile] = useState(false);
    const [fileName, setFileName] = useState('');

    usePageTitle({
        title: 'Edit Staff',
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
        dob: yup.string().required('Please enter Date of Birth'),
        mobile_number: yup.string().required('Please enter Mobile Number'),
        gender: yup.string().required('Please select Gender'),
        department: yup.string().required('Please enter Department'),
        designation: yup.string().required('Please enter Designation'),
        branch: yup.string().required('Please enter Branch'),
        doj: yup.string().required('Please enter Date of Joining'),
        checkboxsignup: yup.bool().oneOf([true], 'Must accept Terms and Conditions'),
        role: yup.string().required('Please select staff role'),
    });

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

    useEffect(() => {
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

        const fetchStaffDetails = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/staff/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data = await response.json();
                
                if (response.ok && data.staff.length > 0) {
                    const staffDetails = data.staff[0];
                    setValue('staff_id',staffDetails.staff_id)
                    setValue('fullname', staffDetails.staff_name);
                    setValue('email', staffDetails.staff_emailId);
                    setValue('dob', new Date(staffDetails.staff_dob).toISOString().substring(0, 10));
                    setValue('mobile_number', staffDetails.staff_mobile_number);
                    setValue('gender', staffDetails.staff_gender);
                    setValue('branch', staffDetails.staff_branch);
                    await handleBranchChange({target:{value:staffDetails.staff_branch}})
                    setValue('department', staffDetails.staff_department);
                    await handleDepartmentChange({target:{value:staffDetails.staff_department}})
                    setValue('designation', staffDetails.staff_designation);
                    setValue('doj', new Date(staffDetails.staff_doj).toISOString().substring(0, 10));
                    setValue('role', staffDetails.staff_role_type);
                } else {
                    console.error('Error fetching staff details:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };
    
        setTimeout(()=>{fetchStaffDetails()},100);
    }, [id]);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    // useEffect(() => {
    //     const fetchDepartmentsAndDesignations = async () => {
    //             const bearerToken = secureLocalStorage.getItem('login');
    //             const [departmentRes, designationRes , branches] = await Promise.all([
    //                 fetch(`${url.nodeapipath}/department/`, {
    //                     method: 'GET',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Access-Control-Allow-Origin': '*',
    //                         'Authorization': `Bearer ${bearerToken}`,
    //                     },
    //                 }),
    //                 fetch(`${url.nodeapipath}/designation/`, {
    //                     method: 'GET',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Access-Control-Allow-Origin': '*',
    //                         'Authorization': `Bearer ${bearerToken}`,
    //                     },
    //                 }),
    //                 fetch(`${url.nodeapipath}/branch/`, {
    //                     method: 'GET',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Access-Control-Allow-Origin': '*',
    //                         'Authorization': `Bearer ${bearerToken}`,
    //                     },
    //                 }),
    //             ]);

    //             const departmentData = await departmentRes.json();
    //             const designationData = await designationRes.json();
    //             const branchData = await branches.json();

    //             if (departmentRes.ok) {
    //                 setDepartments(departmentData.department || []);
    //             } else {
    //                 console.error('Error fetching department:', departmentData);
    //             }

    //             if (designationRes.ok) {
    //                 setDesignation(designationData.designation || []);
    //             } else {
    //                 console.error('Error fetching designation:', designationData);
    //             }

    //             if (branches.ok) {
    //                 setBranches(branchData.branch || []);
    //             } else {
    //                 console.error('Error fetching designation:', branchData);
    //             }
    //     };

    //     fetchDepartmentsAndDesignations();
    // }, []);

    const handlepancardChange = (e: any) => {
        if (e.target.files[0] === undefined || e.target.files[0] === null) {
            setPanFileStatus(false);
            setErrFile(true);
            setFileName('pancard');
        } else {
            setPanFileStatus(true);
            setErrFile(false);
            setStaffPancard(e.target.files[0]);
        }
    };

    const handleaadharcardChange = (e: any) => {
        if (e.target.files[0] === undefined || e.target.files[0] === null) {
            setAadharFileStatus(false);
            setErrFile(true);
            setFileName('aadharcard');
        } else {
            setAadharFileStatus(true);
            setErrFile(false);
            setStaffAadharcard(e.target.files[0]);
        }
    };

    

    const onSubmit = async (data: IFormInput) => {
        console.log(data);
        
        // if (!panFileStatus) {
        //     setErrFile(true);
        //     setFileName('pancard');
        // } else if (!aadharFileStatus) {
        //     setErrFile(true);
        //     setFileName('aadharcard');
        // } 
        // else {
            const formData = new FormData();
            formData.append('staff_name', data.fullname);
            formData.append('staff_dob', data.dob);
            formData.append('staff_password', data.password);
            formData.append('staff_mobile_number', data.mobile_number);
            formData.append('staff_emailId', data.email);
            formData.append('staff_gender', data.gender);
            formData.append('staff_pancard', data.pancard instanceof FileList ? data.pancard[0] : '');
            formData.append('staff_addharcard', data.aadharcard instanceof FileList ? data.aadharcard[0] : '');
            formData.append('staff_department', data.department);
            formData.append('staff_designation', data.designation);
            formData.append('staff_branch', data.branch);
            formData.append('staff_doj', data.doj);
            formData.append('staff_role_type', data.role);

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/staff/${id}`, {
                    body: formData,
                    method: 'PUT',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const result = await response.json();
                console.log('Update successful:', result);
                navigate('/staff');
            } catch (error) {
                console.error('Error during update:', error);
            }
        // }
    };

    

    return (
        <Container>
            <Row className="justify-content-center">
                <Col>
                    <Card className="mt-4">
                        <Card.Body>
                            <h4 className="header-title mt-0 mb-1">Edit Staff Member</h4>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Full Name */}
                               
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
                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="Enter Email"
                                                className="form-control"
                                                {...register('email')}
                                            />
                                            {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                id="password"
                                                placeholder="Enter Password"
                                                className="form-control"
                                                {...register('password')}
                                            />
                                            {/* {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>} */}
                                        </div>

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
                                            <input
                                                type="text"
                                                id="mobile_number"
                                                placeholder="Enter Mobile Number"
                                                className="form-control"
                                                {...register('mobile_number')}
                                            />
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
                                    </Col>

                                    <Col md={6}>
                                    <div className="mb-3">
                                            <label htmlFor="fullname" className="form-label">Staff Id</label>
                                            <input
                                                type="text"
                                                id="fullname"
                                                placeholder="Enter Full Name"
                                                className="form-control"
                                                {...register('staff_id')}
                                                disabled={true}
                                            />
                                            {/* {errors.fullname && <div className="invalid-feedback d-block">{errors.fullname.message}</div>} */}
                                        </div>
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
                                            {/* {(errFile && fileName == 'pancard')?(<div className="invalid-feedback d-block">Please upload PAN Card</div>):''} */}

                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="aadharcard" className="form-label">Aadhar Card</label>
                                            <input
                                                type="file"
                                                id="aadharcard"
                                                className="form-control"
                                                {...register('aadharcard')}
                                                onChange={(e)=>{handleaadharcardChange(e)}}

                                            />
                                            {/* {errors.aadharcard && <div className="invalid-feedback d-block">{errors.aadharcard.message}</div>} */}
                                            {/* {(errFile && fileName == 'aadharcard')?(<div className="invalid-feedback d-block">Please upload Aadhar Card</div>):''} */}
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
                                </Row>
                                <div className="text-md-end mb-0">
                                    <Button variant="primary" className="me-1" type="submit">
                                        Update
                                    </Button>
                                    <Button variant="secondary" type="reset" onClick={()=>{navigate('/staff')}}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditStaff;
