import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
  Tabs,
  Radio,
  Breadcrumb,
  Space,
  DatePicker,
  Upload,
} from "antd";
import type { RadioChangeEvent,UploadProps} from 'antd';
import {
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined,
  InboxOutlined
} from "@ant-design/icons";
import { 
  useDeleteProject, 
  useCreateProject, 
  useUpdateProject 
} from "../../hooks/useProject";
import type { UploadFile } from "antd/es/upload/interface";
import { useProductType } from "../../hooks/useProductType";
import { useProvince } from "../../hooks/useProvince";
import { useDistrict } from "../../hooks/useDistrict";
import { useSubdistrict } from "../../hooks/useSubdistrict";
const FormProject: React.FC<any> = ({ visible, handleCloseModalProject, project }) => {

  const [loading, setLoading] = useState(false);
  const [hiddenPrint, setHiddenPrint] = useState(false);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);
  const [districtList, setDistrictList] = useState<any>([]);
  const [subdistrictList, setSubdistrictList] = useState<any>([]);
  const [dateTime, setDateTime] = useState(moment().format("YYYY-MM-DD"));
  const [dateTimeEnd, setDateTimeEnd] = useState(moment().format("YYYY-MM-DD"));

  const [formProject] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const propsFile = {
    beforeUpload: (file: any) => {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg" || file.type === "image/jpeg";

      if (!isPNG && !isJPG) {
        message.error(`${file.name} is not a png or jpg file`);
      }
      return isPNG || isJPG || Upload.LIST_IGNORE;
    },
    onChange: (info: any) => {
      //console.log(info.fileList);
      setFileList(info.fileList);
    },
  };

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateProject();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateProject();

  const {
    data: ProductType,
  } = useProductType();


  const {
    data: Province,
  } = useProvince();

  const {
    isLoading: DistrictIsLoading,
    isError: DistrictIsError,
    data: District,
    status: DistrictStatus,
    error: DistrictError,
    mutate: getDistrict,
  } = useDistrict();

  const {
    isLoading: SubdistrictIsLoading,
    isError: SubdistrictIsError,
    data: Subdistrict,
    status: SubdistrictStatus,
    error: SubdistrictError,
    mutate: getSubdistrict,
  } = useSubdistrict();

  
  const setProvinceFunc = (value: any) => {

    console.log(value);
    setDistrictList([]);
    setSubdistrictList([]);
    formProject.setFieldsValue({
      Province_Name: null,
      District:null,
      District_Name: null,
      Subdistrict:null
    });

    if(value != undefined || value != null){
      const Province = value.split("|");
      console.log(Province[0]);
      console.log(Province[1]);
      formProject.setFieldsValue({
        Province_Name: Province[1],
      });
      getDistrict(Province[0]);
    }
    
  };

  const setDistrictFunc = (value: any) => {

    console.log(value);
    setSubdistrictList([]);
    formProject.setFieldsValue({
      District_Name: null,
      Subdistrict:null
    });

    if(value != undefined || value != null){
      const District = value.split("|");
      console.log(District[0]);
      console.log(District[1]);
      formProject.setFieldsValue({
        District_Name: District[1],
      });
      getSubdistrict(District[0]);
    }
    
  };

  const setSubdistrictFunc = (value: any) => {

    console.log(value);
    formProject.setFieldsValue({
      Subdistrict_Name:null
    });

    if(value != undefined || value != null){
      const Subdistrict = value.split("|");
      console.log(Subdistrict[0]);
      console.log(Subdistrict[1]);
      formProject.setFieldsValue({
        Subdistrict_Name: Subdistrict[1],
        Postal_Code: Subdistrict[0]
      });
    }
    
  };




  useEffect(() => {
    if (DistrictStatus === "success") {
      
      setDistrictList(District?.data.data);
    } else if (DistrictStatus === "error") {
      message.error(DistrictError?.response?.data?.message || DistrictError.message);
    }
  }, [DistrictStatus]);

  useEffect(() => {
    if (SubdistrictStatus === "success") {
      setSubdistrictList(Subdistrict?.data.data);
    } else if (SubdistrictStatus === "error") {
      message.error(SubdistrictError?.response?.data?.message || SubdistrictError.message);
    }
  }, [SubdistrictStatus]);
  
  


  const handleOk = (value: any) => {
    //setLoading(true);

    console.log('save =',value);


    if (value?.Project_ID) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };

  useEffect(() => {
    console.log('project =',project);
    formProject.resetFields();

    formProject.setFieldsValue({
      Project_ID: project?.Project_ID || null,
      Customer_ID: project?.Customer_ID || null,
      Project_Name: project?.Project_Name || "",
      Customer_Name: project?.Customer_Name || "",
      Phone_Number: project?.Phone_Number || "",
      Warranty_Type: project?.Warranty_Type || "",
      Warranty_Period: project?.Warranty_Period || "",
      Start_Date: moment(project.Start_Date)|| null,
      End_Date: moment(project.Start_Date) || null,

    });

  }, [project]);
  


  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Project Success");
      handleCloseModalProject();
      formProject.resetFields();
      setLoading(false);
    } else if (createStatus === "error") {
      setLoading(false);
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Project Success");
      handleCloseModalProject();
      setLoading(false);
    } else if (updateStatus === "error") {
      setLoading(false);
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };




  return (
    <>
      <Modal
        visible={visible}
        title="ข้อมูลโครงการ"
        onOk={formProject.submit}
        onCancel={handleCloseModalProject}
        width={600}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formProject.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModalProject}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formProject}
          name="formProject"
          onFinish={handleOk}
        >
          <Form.Item name="Project_ID" label="Project_ID" hidden>
            <Input />
          </Form.Item>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Customer_ID"
                label="หมายเลขลูกค้า/Customer ID"
                rules={[{ required: true, message: "Please enter Customer ID" }]}
              >
                <Input placeholder="Please enter Customer ID" disabled={parseInt(project?.event) !== 0 ? true : false}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Name_Project"
                label="ชื่อโครงการ/Project Name"
                rules={[
                  { required: true, message: "Please enter Project Name" },
                ]}
              >
                <Input placeholder="Please enter Project Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Customer_Name"
                label="ชื่อบริษัท/Customer Name"
                rules={[
                  { required: true, message: "Please enter Customer Name" },
                ]}
              >
                <Input placeholder="Please enter Customer Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Phone_Number"
                label="เบอร์โทรศัพท์มือถิอ/Phone Number"
                rules={[
                  { required: true, message: "Please enter Phone Number" },
                ]}
              >
                <Input placeholder="Please enter Phone Number" />
              </Form.Item>
            </Col>
          </Row>
          

          <Row>
            <Col span={24}>
              <Form.Item
                  name="Warranty_Type"
                  label="ประเภทการรับประกัน/Warranty Type"
                  rules={[
                    {
                      required: true,
                      message: "เลือกประกันการรับประกัน",
                    },
                  ]}
                >
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value={1} checked={project?.Warranty_Type == '1' ? true : false}>วันที่วางบิล</Radio>
                    <Radio value={2} checked={project?.Warranty_Type == '2' ? true : false}>วันที่ส่ง</Radio>
                    <Radio value={3} checked={project?.Warranty_Type == '3' ? true : false}>วันที่ออกใบเสร็จ</Radio>
                    <Radio value={4} checked={project?.Warranty_Type == '4' ? true : false}>วันที่เปิดโครงการ</Radio>
                    <Radio value={5} checked={project?.Warranty_Type == '5' ? true : false}>
                      อื่นๆ
                      {value === 5 ? 
                      <Form.Item
                        name="Warranty_Type_Other"
                      >
                        <Input/>
                      </Form.Item> : null
                      }
                    </Radio>
                  </Space>
                </Radio.Group>
                </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              ระยะเวลารับประกัน
            </Col>
            <Col span={3}>
              <Form.Item
                name="Warranty_Period"
                rules={[
                  { required: true, message: "Please enter " },
                ]}
              >
                <InputNumber style={{ width: 70 }}/>
              </Form.Item>
            </Col>
            <Col span={4}>
              <span style={{marginLeft:30}}>
              เดือน
              </span>
                
            </Col>
            <Col span={4}>
              วันที่เริ่มต้น
            </Col>
            <Col span={6}>
            
              <Form.Item
                name="Start_Date"
                rules={[
                  { required: true, message: "Please enter " },
                ]}
              >
                <DatePicker className="myDatePicker"/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              วันที่เริ่มต้น
            </Col>
            <Col span={6}>
            
              <Form.Item
                name="Start_Date"
                rules={[
                  { required: true, message: "Please enter " },
                ]}
              >
                <DatePicker className="myDatePicker"/>
              </Form.Item>
            </Col>
            <Col span={5}>
              <span style={{marginLeft:30}}>
              สิ้นสุด
              </span>
                
            </Col>
            <Col span={6}>
              <Form.Item
                name="End_Date"
                rules={[
                  { required: true, message: "Please enter " },
                ]}
              >
                <DatePicker className="myDatePicker"/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Remark"
                label="หมายเหตุ"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Picture">
                <Form.Item name="Picture" noStyle>
                  <Upload.Dragger
                    {...propsFile}
                    listType="picture"
                    fileList={fileList}
                    maxCount={1}
                    name="files"
                    action="/"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file (png, jpg) to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single upload.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Modal>

    </>
  );
};

export default FormProject;
