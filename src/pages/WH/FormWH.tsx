import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
  Card,
} from "antd";
import {
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined,
  SearchOutlined,
  ClearOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useGrade,
  useDeleteGrade, 
  useCreateGrade, 
  useUpdateGrade 
} from "../../hooks/useGrade";

import { 
  useProject, 
} from "../../hooks/useProject";
import { useProductType } from "../../hooks/useProductType";

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  Grade_Name: string;
  Grade_Description: string;
  QTY: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const FormWH: React.FC<any> = ({ visible, handleCloseModal, WH }) => {

  const [loading, setLoading] = useState(false);
  const [hiddenPrint, setHiddenPrint] = useState(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);
  const [projectID, setProjectID] = useState<any>([]);
  const [withdrawNo, setWithdrawNo] = useState<any>([]);

  const [material, setMaterial] = useState<any>([]);
  const [qty, setQty] = useState<any>([]);

  const [formWH] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;
  

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateGrade();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateGrade();

  const {
    data: ProductType,
  } = useProductType();


  const {
    data: ProjectName,
  } = useProject();

  const {
    data: GradeItem,
  } = useGrade();


  const handleOk = (value: any) => {
    // setLoading(true);
    // if (value?.WH_Index) {
    //   updateMutate(value);
    // } else {
    //   createMutate(value);
    // }
  };


  const handleSearch = () => {
    console.log('P =',projectID);
    console.log('W =',withdrawNo);
  };

  const handleClear = () => {
    formWH.setFieldsValue({
      Project_ID: null,
      Withdraw_No: null,
    });


  };

  const setProjectIDFunc = (value : any) => {

    console.log('P ID =',value);
    setProjectID(value);

  };

  const setWithdrawNoFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('W No =',e.target.value);
    setWithdrawNo(e.target.value);

  };

  const setMaterialFunc = (value : any) => {

    console.log('P ID =',value);
    setMaterial(value);

  };

  const setQtyFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('W No =',e.target.value);
    setQty(e.target.value);

  };

  const handleAddItem = () => {
    console.log('material =',material);
    console.log('qty =',qty);
    let _dataSource = [...dataSource];
    console.log('FF =',_dataSource);

    const Grade = material.split("|");

    const search = (obj:any) => obj.Grade_Name === Grade[0];

    const indexFind = _dataSource.findIndex(search); 

    console.log('indexFind =',indexFind);

    if (indexFind === -1) { //ไม่ซ้ำ
      const new_value = {
        Grade_Name: Grade[0],
        Grade_Description: Grade[1],
        QTY:qty,
      };

      // _dataSource.push(new_value);
      setDataSource(_dataSource);
    }

    // const newData = [...dataSource];
    // const index = newData.findIndex((item) => value.key === item.key);
    // const item = newData[index];

    // newData.splice(index, 1, {
    //   ...item,
    //   ...new_value,
    // });

  };


  
  const handleQtyPrint = (e:any) => {
    setDataSourcePrint({ITEM_CODE: WH?.ITEM_CODE, QTY: e});
  };



  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Material Success");
      handleCloseModal();
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
      message.success("Update Material Success");
      handleCloseModal();
      setLoading(false);
    } else if (updateStatus === "error") {
      setLoading(false);
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);


  useEffect(() => {
    formWH.resetFields();
    formWH.setFieldsValue({
      Grade_Index: WH?.ITEM_ID || null,
    });

    if(WH?.Product_ID == '3'){
      setHiddenPrint(false); 
      formPrint.setFieldsValue({
        Num_Print: 1,
      });
      setDataSourcePrint({ITEM_CODE: WH?.ITEM_CODE, QTY: 1});
    }else{
      setHiddenPrint(true);
    }
    
    
  }, [WH]);


  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Material Name",
      dataIndex: "Grade_Name",
      width: "30%",
      // editable: true,
    },
    {
      title: "Description",
      dataIndex: "Grade_Description",
      width: "40%",
      // editable: true,
    },
   
   
    {
      title: "QTY",
      dataIndex: "QTY",
      align: "center",
      // editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      // render: (_, record: any) => {
      //   if (eventItem == "Add" || receivedetail.Total_Tag == 0) {
      //     return (
      //       <>
      //         <EditOutlined
      //           onClick={() => {
      //             onEditItem(record);
      //           }}
      //         />
      //         <Popconfirm
      //           title="Sure to delete?"
      //           onConfirm={() => handleDelete(record.key)}
      //         >
      //           <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
      //         </Popconfirm>
      //       </>
      //     );
      //   }
      // },
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        // handleSave,
      }),
    };
  });

  return (
    <>
      <Modal
        visible={visible}
        title="Warehouse"
        onOk={formWH.submit}
        onCancel={handleCloseModal}
        width={800}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formWH.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModal}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formWH}
          name="formWH"
          onFinish={handleOk}
        >
          <Form.Item name="Warehouse_ID" label="WH Index" hidden>
            <Input />
          </Form.Item>
          <Card>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Project_ID"
                label="Project Name"
                rules={[
                  { required: true, message: "Please choose Project Name" },
                ]}
              >
                <Select
                  placeholder="Please choose Project Name"
                  onChange={(e) => setProjectIDFunc(e)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  
                >
                  {ProjectName?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.Project_ID}
                        value={value.Project_Name}
                      >
                        {value.Project_Name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Withdraw_No"
                label="Withdraw No"
                rules={[{ required: true, message: "Please enter Withdraw No" }]}
              >
                <Input placeholder="Please enter Withdraw No" onChange={(e) => setWithdrawNoFunc(e)}/>
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col span={24} >
            <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleSearch}
                icon={<SearchOutlined className="relative bottom-[0.2em]" />}
              >
                Search
              </Button>
              <Button
                key="back"
                type="primary"
                className="btn-warning"
                onClick={handleClear}
                icon={<ClearOutlined className="relative bottom-[0.2em]" />}
              >
                Clear
              </Button>
            </Col>
          </Row>
          </Card>
          <Card>
          <Table
            rowKey={(record: any) => record.ITEM_ID}
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
            bordered
            size="small"
            // loading={isLoading}
            columns={columns as any}
            //dataSource={WHSearch}
            pagination={{ pageSize: 50 }}
            // scroll={{ y: 800 }}
          />     

          </Card>
          <Card>
            <Row gutter={16}>
              <Col span={12}>
                  <Form.Item name="Grade_Name" label="Grade_Name" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="Grade_Name"
                    label="Material"
                    rules={[
                      {
                        required: true,
                        message: "Please choose Material",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please choose Material"
                      onChange={(e) => setMaterialFunc(e)}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      //disabled={disabled}
                    >
                      {GradeItem?.data?.data?.map((value: any) => {
                        return (
                          <Option 
                            key={value.ITEM_CODE} 
                            value={value.ITEM_CODE+'|'+value.ITEM_DESCRIPTION}>
                            {value.ITEM_CODE}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="Qty"
                    label="Qty"
                    rules={[{ required: true, message: "Please enter Qty" }]}
                    
                  >
                    <Input placeholder="Please enter Qty" onChange={(e) => setQtyFunc(e)}/>
                  </Form.Item>
                </Col>
                <Col>
                <Button
                  type="primary"
                  className="btn-success"
                  icon={<PlusOutlined className="relative bottom-[0.2em]" />}
                  onClick={handleAddItem}
                  style={{marginTop:30}}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Card>
    
        </Form>
        
      </Modal>

    </>
  );
};

export default FormWH;
