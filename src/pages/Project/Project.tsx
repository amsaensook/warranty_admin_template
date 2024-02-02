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
  useDeleteProject
} from "../../hooks/useProject";
import { useDispatch, useSelector } from "react-redux";
import { setQR, selectQR } from "../../contexts/slices/qrSlice";
import FormProject from "./FormProject";

import { 
  useProject
} from "../../hooks/useProject";

const Project: React.FC<any> = () => {
  const [visible, setVisible] = useState(false);
  const [visibleHistory, setVisibleHistory] = useState(false);
  const [visibleProject, setVisibleProject] = useState(false);
  const [visibleProductList, setVisibleProductList] = useState(false);
  const [project, setProject] = useState<any>({});

  const [projectSearch, setProjectSearch] = useState<any>([]);
  const { TabPane } = Tabs;
  const [formProject] = Form.useForm();
  const qr = useSelector(selectQR);



  const {
    isLoading,
    isFetching,
    isError,
    data: Projectdata,
    status,
    error,
  } = useProject();


  const {
    error: deleteErrorProject,
    status: deleteStatusProject,
    mutate: deleteMutateProject,
  } = useDeleteProject();



  const showModalProject = () => {
    formProject.resetFields();
    setVisibleProject(true);

    
  };




  const handleAddProject = () => {
    showModalProject();
    setProject({ event: "0" });
  };



  const handleCloseModalProject = () => {
    setVisibleProject(false);
    formProject.resetFields();
  };



  useEffect(() => {
    setProjectSearch(Projectdata?.data.data || []);
    console.log('F =',Projectdata?.data.data );
    console.log('RERERERER');
  }, [isFetching]);



  useEffect(() => {
    if (deleteStatusProject === "success") {
      message.success("Delete Success");
    } else if (deleteStatusProject === "error") {
      message.error(
        deleteErrorProject?.response?.data?.message || deleteErrorProject.message
      );
    }
  }, [deleteStatusProject]);



  const menuProject = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenuProject(e, record);
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

  const handleMenuProject = (e: any, record: any) => {
    console.log('xxxx =',record);
    switch (e.key) {
      case "1":
        showModalProject();
        setProject({ ...record, event: e.key });

        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: (
            <>{`Do you want delete Project : ${record.Project_Name} ?`}</>
          ),
          onOk: () => {
            deleteMutateProject(record.Project_ID);
          },
        });

        break;
    }
  };




  const columns_project = [
    {
      title: "",
      key: "Action",
      className: "w-10",
      render: (text: any, record: any, index: any) => {
        return (
          <Dropdown trigger={["click"]} overlay={menuProject(record)}>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "หมายเลขลูกค้า",
      dataIndex: "Customer_ID",
      key: "Customer_ID",
      align: "center",
      sorter: (a: any, b: any) => a.Customer_ID.localeCompare(b.Customer_ID),
    },
    {
      title: "ชื่อโครงการ",
      dataIndex: "Project_Name",
      key: "Project_Name",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.Project_Name.localeCompare(b.Project_Name),
    },
    {
      title: "ชื่อบริษัท",
      dataIndex: "Customer_Name",
      key: "Customer_Name",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Customer_Name.localeCompare(b.Customer_Name),
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "Phone_Number",
      key: "Phone_Number",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Phone_Number.localeCompare(b.Phone_Number),
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
                onClick={handleAddProject}
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
              columns={columns_project as any}
              dataSource={projectSearch}
              pagination={{ pageSize: 50 }}
              // scroll={{ y: 800 }}
            />
       

        
      </Space>


      <FormProject
        visible={visibleProject}
        handleCloseModalProject={handleCloseModalProject}
        project={project}
      />

      
    </>
  );
};

export default Project;
