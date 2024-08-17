import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';

interface LuckyDrawEntry {
    _id: string;
    luckydraw_month: string;
    sipmember: string;
    sipmemberId:string;
    sipMemberName:string;
    luckydraw_rank: string;
    payment_status:string;
}

interface DataResponse {
    luckyDraw: LuckyDrawEntry[];
}

const LuckyDraw = () => {
    const [data, setData] = useState<LuckyDrawEntry[]>([]);
    const navigate = useNavigate();
    const [entryDeleted, setEntryDeleted] = useState(false);

    const handleEdit = (id: string) => {
        navigate(`/edit-luckydraw/${id}`);
    };

    const handleDelete = async (id: string) => {
        const bearerToken = secureLocalStorage.getItem('login');
        try {
            const response = await fetch(`${url.nodeapipath}/luckydraw/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${bearerToken}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                console.log('LuckyDraw entry deleted successfully:', result);
                setEntryDeleted(true);
            } else {
                console.error('Error deleting LuckyDraw entry:', result);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    usePageTitle({
        title: 'Lucky Draw',
        breadCrumbItems: [
            {
                path: '/luckydraw',
                label: 'Lucky Draw',
                active: true,
            },
        ],
    });
    const formatDate = (dateString:any)=> {
        const [year, month] = dateString.split('-');
        
        // Create a date object using the year and month
        const date = new Date(`${year}-${month}-01`);
        
        // Format the month to get the full month name
        const options = { month: "long" };
        const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
        
        return `${monthName}-${year}`;
    }

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        const fetchLuckyDrawEntries = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/luckydraw/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data: DataResponse = await response.json();
                // console.log(data);
                
                if (response.ok) {
                    const formattedData = data.luckyDraw.map((entry, index) => ({
                        srNo: index + 1,
                        _id:entry._id,
                        luckydraw_month: formatDate(entry.luckydraw_month),
                        sipmember: `${entry.sipmemberId}-${entry.sipMemberName}`,
                        sipmemberId:entry.sipmemberId,
                        sipMemberName:entry.sipMemberName,
                        luckydraw_rank: entry.luckydraw_rank,
                        payment_status:entry.payment_status,
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching LuckyDraw entries:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchLuckyDrawEntries();
    }, [entryDeleted]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddEntry = () => {
        navigate('/add-luckydraw');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Month',
            accessor: 'luckydraw_month',
            sort: true,
        },
        {
            Header: 'Member ID',
            accessor: 'sipmember',
            sort: true,
        },
        {
            Header: 'Rank',
            accessor: 'luckydraw_rank',
            sort: true,
        },
        {
            Header: 'Payment Status',
            accessor: 'payment_status',
            sort: true,
        },
        
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: { row: any }) => (
                <>
                    <Button
                        variant="primary"
                        onClick={() => handleEdit(row.original._id)}
                    >
                        Edit
                    </Button>
                    &nbsp;
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(row.original._id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Row style={{ marginTop: '25px' }}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">All LuckyDraw Entries</h4>
                                <p className="text-muted font-14 mb-4">A table showing all LuckyDraw entries</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddEntry}>
                                Add Entry
                            </Button>
                        </div>

                        <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            isSearchable={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default LuckyDraw;
