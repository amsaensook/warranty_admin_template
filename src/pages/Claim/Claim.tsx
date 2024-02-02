import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Menu,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  Tabs,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { 
  useCustomer, 
  useDeleteCustomer, 
  useCreateCustomer, 
  useUpdateCustomer 
} from "../../hooks/useCustomer";
import { useDispatch, useSelector } from "react-redux";
import { setQR, selectQR } from "../../contexts/slices/qrSlice";
import { useCustomerNo } from "../../hooks/useCustomerNo";
import FormClaim from "./FormClaim";

const Customer: React.FC<any> = () => {
  const [visibleClaim, setVisibleClaim] = useState(false);
  const [Claim, setClaim] = useState<any>({});
  const [customerSearch, setCustomerSearch] = useState<any>([]);
  const [ClaimSearch, setClaimSearch] = useState<any>([]);
  const { TabPane } = Tabs;
  const [formClaim] = Form.useForm();
  const qr = useSelector(selectQR);
  const {
    isLoading,
    isFetching,
    isError,
    data: Customerdata,
    status,
    error,
  } = useCustomer();

  const {
    mutate: createMutate,
  } = useCreateCustomer();

  const {
    mutate: updateMutate,
  } = useUpdateCustomer();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteCustomer();



  const showModalClaim = () => {
    formClaim.resetFields();
    setVisibleClaim(true);

    
  };



  const handleAddClaim = () => {
    showModalClaim();
    setClaim({ event: "0" });
  };



  const handleCloseModalClaim = () => {
    setVisibleClaim(false);
    formClaim.resetFields();
  };
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const customerDataSearch = Customerdata?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setCustomerSearch(customerDataSearch);
    } else {
      setCustomerSearch(Customerdata?.data.data || []);
    }
  };

  useEffect(() => {
    setCustomerSearch(Customerdata?.data.data || []);
  }, [isFetching]);


  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Material Success");
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  const menu = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <Menu.Item key="1" icon={<EditOutlined />}>
        Detail
      </Menu.Item>
      <Menu.Item key="2" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleMenu = (e: any, record: any) => {
    console.log('xxxx =',record);
    switch (e.key) {
      case "1":
        showModalClaim();
        setClaim({ ...record, event: e.key });

        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: (
            <>{`Do you want delete Claim No : ${record.Fullname} ?`}</>
          ),
          onOk: () => {
            deleteMutate(record.Customer_ID);
          },
        });

        break;
    }
  };

  const columns = [
    {
      title: "",
      key: "Action",
      className: "w-10",
      render: (text: any, record: any, index: any) => {
        return (
          <Dropdown trigger={["click"]} overlay={menu(record)}>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "หมายเลขลูกค้า",
      dataIndex: "Customer_No",
      key: "Customer_No",
      align: "center",
      sorter: (a: any, b: any) => a.Customer_No.localeCompare(b.Customer_No),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "Fullname",
      key: "Fullname",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.Fullname.localeCompare(b.Fullname),
    },
    {
      title: "เลขบัตรประชาชน",
      dataIndex: "ID_Card_Number",
      key: "ID_Card_Number",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ID_Card_Number.localeCompare(b.ID_Card_Number),
    },
    {
      title: "เบอร์",
      dataIndex: "Phone_Number",
      key: "Phone_Number",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Phone_Number.localeCompare(b.Phone_Number),
    },
    {
      title: "ที่อยู่",
      dataIndex: "Address",
      key: "Address",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Address.localeCompare(b.Address),
    },
    {
      title: "ตำบล/แขวง",
      dataIndex: "Subdistrict",
      key: "Subdistrict",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Subdistrict.localeCompare(b.Subdistrict),
    },
    {
      title: "อำเภอ/เขต",
      dataIndex: "District",
      key: "District",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.District.localeCompare(b.District),
    },
    {
      title: "จังหวัด",
      dataIndex: "Province",
      key: "Province",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Province.localeCompare(b.Province),
    },
    {
      title: "รหัสไปรษณีย์",
      dataIndex: "Postal_Code",
      key: "Postal_Code",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Postal_Code.localeCompare(b.Postal_Code),
    },

   
  ];

  return (
    <>
      <Space className="w-[100%]" direction="vertical">

            <Row style={{ marginBottom: 8 }}>
              <Col flex={1}>
                <Button
                  type="primary"
                  className="btn-success"
                  icon={<PlusOutlined className="relative bottom-[0.2em]" />}
                  onClick={handleAddClaim}
                >
                  Add
                </Button>
                &nbsp;
              </Col>
              <Col className="flex justify-end items-center" flex={1}>
                <Input
                  style={{ width: 300 }}
                  prefix={<SearchOutlined />}
                  placeholder="Search"
                />
              </Col>
            </Row>
            <Table
              rowKey={(record: any) => record.ITEM_ID}
              rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
              bordered
              size="small"
              loading={isLoading}
              columns={columns as any}
              // dataSource={customerSearch}
              pagination={{ pageSize: 50 }}
              // scroll={{ y: 800 }}
            />




       

        
      </Space>

      <FormClaim
        visible={visibleClaim}
        handleCloseModal={handleCloseModalClaim}
        Claim={Claim}
      />

      
    </>
  );
};

export default Customer;
