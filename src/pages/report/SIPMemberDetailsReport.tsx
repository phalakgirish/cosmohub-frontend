import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, FormText } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Controller, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

interface Payment {
    sipmember_id: string,
    client_id: string,
    sipmember_name: string,
    sipmember_doj: string,
    sipmember_maturity_date: string,
    totalSIPAmount: number,
    totalSIPPenaltyAmount: number
}

interface Month {
    month: string;
}

interface DataResponse {
    sipMemberDetails: Payment[];
}

const SIPMemberDetailsReport = () => {
    const [data, setData] = useState<Payment[]>([]);
    const navigate = useNavigate();
    const [paymentDeleted, setPaymentDeleted] = useState(false);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [month,setMonth] = useState('');

    usePageTitle({
        title: 'SIP Member Details Report',
        breadCrumbItems: [
            {
                path: '/payments',
                label: 'Payments',
                active: true,
            },
        ],
    });

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    }
    const formatMonthDate = (dateString:any)=> {
        if(dateString == '')
            return '';
        const [year, month] = dateString.split('-');
        
        // Create a date object using the year and month
        const date = new Date(`${year}-${month}-01`);
        
        // Format the month to get the full month name
        const options = { month: "long" };
        const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
        
        return `${monthName}-${year}`;
    }

    useEffect(() => {
        fetchMemberDetails();
    }, []);


    
        const fetchMemberDetails = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/report/sip_members?branchId=${userData.staff_branch}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data: DataResponse = await response.json();
                
                
                if (response.ok) {
                    const formattedData = data.sipMemberDetails.map((payment, index) => ({
                        srNo: index + 1,
                        sipmember_id: payment.sipmember_id,
                        client_id: payment.client_id,
                        sipmember_name: payment.sipmember_name,
                        sipmember_doj: formatDate(new Date(payment.sipmember_doj)),
                        sipmember_maturity_date: formatDate(new Date(payment.sipmember_maturity_date)),
                        totalSIPAmount: payment.totalSIPAmount,
                        totalSIPPenaltyAmount: payment.totalSIPPenaltyAmount,
                    }));

                    setData(formattedData);
                } else {
                    console.error('Error fetching payments:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        const handleSearchPayment = ()=>{
            // fetchPayments();
        }
        const handleExportPayment = ()=>{
            if(data.length == 0)
                return;
            exportToExcel(columns,Excelcolumns,data,`SIP Member Details Report.xlsx`)
        }

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const Excelcolumns = ['Sr. No','SIP Id','Client Id','Member Name','Joining Date','Maturity Date','Total SIP Amount','Total Penalty Amount'];

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'SIP Id',
            accessor: 'sipmember_id',
            sort: true,
        },
        {
            Header: 'Client Id',
            accessor: 'client_id',
            sort: true,
        },
        {
            Header: 'Member Name',
            accessor: 'sipmember_name',
            sort: true,
        },
        {
            Header: 'Joining Date',
            accessor: 'sipmember_doj',
            sort: true,
        },
        {
            Header: 'Maturity Date',
            accessor: 'sipmember_maturity_date',
            sort: true,
        },
        {
            Header: 'Total SIP Amount',
            accessor: 'totalSIPAmount',
            sort: true,
        },
        {
            Header: 'Total Penalty Amount',
            accessor: 'totalSIPPenaltyAmount',
            sort: true,
        },
    ];


    const exportToExcel = (columns:any,columnHeader:any, data:any, fileName:any) => {
        // console.log(data);
        
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
    
        // Map the data to an array of objects with the specified column names
        const worksheetData = data.map((item:any) =>
            columns.reduce((acc:any, column:any) => {
                acc[column.Header] = item[column.accessor];
                return acc;
            }, {})
        );

        console.log();
        
    
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: columnHeader });
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Generate Excel file and download it
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <Row style={{ marginTop: '25px' }}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <div>
                                <h4 className="header-title">SIP Member Details Report</h4>
                                <p className="text-muted font-14">A table showing member details report</p>
                            </div>
                        </div>
                        <div className="mb-1">
                                <Row>
                                    <Col md={6}>
                                    </Col>
                                    <Col md={6} style={{ textAlign:'end' }}>
                                        <Button style={{ height: '40px', backgroundColor: '#05711e'}} onClick={handleExportPayment}>
                                                Export
                                        </Button>
                                    </Col>
                                </Row>
                        </div>
                        <hr />
                        <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            // isSearchable={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer/>
        </Row>
    );
};

export default SIPMemberDetailsReport;
