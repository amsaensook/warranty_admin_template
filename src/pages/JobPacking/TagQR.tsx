import React, { useContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setQR, selectQR } from "../../contexts/slices/qrSlice";
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
  DatePicker,
  Popconfirm,
  Card,
} from "antd";
import {
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useSelectTag,
} from "../../hooks/useTag";
import {
  useJobPackingItem,
} from "../../hooks/useJobPacking";

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  Tag_ID: React.Key;
  QR_NO: string;
  Item_ID: string;
  ITEM_CODE: string;
  ITEM_DESCRIPTION: string;
  Lot_No: string;
  Qty: Number;
  Product_ID:Number;
}
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const FormTag: React.FC<any> = ({ visible, handleCloseModelTag, tag, displayPrint }) => {

  const [formTagQR] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countTag, setCountTag] = useState(0);
  const qr = useSelector(selectQR);
  const { Option } = Select;

  const hasSelected = countTag > 0;

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);
  const [dataSourceVirtual, setDataSourceVirtual] = useState<DataType[]>([]);

  const [detailGradeLot, setGradeLot] = useState<any>([]);


  const {
    isLoading: selectTagIsLoading,
    isError: selectTagIsError,
    data: Tagdata,
    error: selectTagError,
    status: selectTagStatus,
    mutate: selectTag,
  } = useSelectTag();

  const {
    data: JobPackingItem,
    error: createErrorJobPackingItem,
    status: getStatusJobPackingItem,
    mutate: getJobPackingItem,
  } = useJobPackingItem();

 

  useEffect(() => {
    formTagQR.resetFields();
    setCountTag(tag?.Qty);
    formTagQR.setFieldsValue({
      Receive_Index: tag?.Job_ID || null,
      Receive_No: tag?.Job_No || null,
      Receive_Date: moment(tag?.Job_Date),
      Total_QTY: tag?.Qty || null,
    });
    selectTag(tag?.Job_ID);
  }, [tag]);


  useEffect(() => {
    if (selectTagStatus === "success") {
      setDataSource(Tagdata?.data.data || []);

      if (!Tagdata?.data.data || Tagdata?.data.data.length <= 0) {
      }else{
        getJobPackingItem(tag?.Job_ID);
        
        formTagQR.setFieldsValue({
          QR_Code1: Tagdata?.data.data[0]?.QR_NO || [],
          QR_Code2: Tagdata?.data.data[tag?.Qty - 1]?.QR_NO || [],
        });

        setDataSourcePrint(Tagdata?.data.data.filter(
        (valueType: any) => valueType.Product_ID !== 4 ) || []);
        setDataSourceVirtual(Tagdata?.data.data || []);
          
      }
    }
  }, [selectTagStatus]);

  useEffect(() => {
    if (getStatusJobPackingItem === "success") {

      
      setGradeLot(JobPackingItem?.data.data || []);
      
    } else if (getStatusJobPackingItem === "error") {
      message.error(
        createErrorJobPackingItem?.response?.data?.message ||
          createErrorJobPackingItem.message
      );
    }
  }, [getStatusJobPackingItem]);



  

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "QR Code",
      dataIndex: "QR_NO",
      width: "13%",
      sorter: (a: any, b: any) => a.QR_NO.localeCompare(b.QR_NO),
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      width: "15%",
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Material Name",
      dataIndex: "ITEM_DESCRIPTION",
      width: "28%",
      sorter: (a: any, b: any) => a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "Type",
      dataIndex: "Product_DESCRIPTION",
      width: "10%",
      sorter: (a: any, b: any) => a.Product_DESCRIPTION.localeCompare(b.Product_DESCRIPTION),
    },
    {
      title: "Lot No",
      dataIndex: "Lot_No",
      align: "center",
      width: "10%",
    },
    {
      title: "QTY",
      dataIndex: "QtyItem",
      align: "center",
      width: "7%",
    },
    
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      width: "5%",
      render: (_, record: any) => { 
          return (
            <>
              <button
                onClick={() => {
                  localStorage.setItem("qr", JSON.stringify(record));

                  window.open(
                    `${import.meta.env.VITE_APP_PUBLIC_URL}${"/QrCodePrint"}`
                  );
                }}
                hidden={displayPrint}
              >
                <PrinterOutlined />
                
              </button>
            </>
          );
      },
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
      }),
    };
  });


  return (
    <>
      <Modal
        visible={visible}
        title="Print QR Code"
        style={{ top: 20 }}
        onCancel={handleCloseModelTag}
        width={1200}
        
        footer={[
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModelTag}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form layout="vertical" form={formTagQR} name="formTagQR">
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form.Item name="Receive_Index" label="Receive_Index" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16} style={{marginTop:-15}}>
                <Col span={5}>
                  <Form.Item name="Receive_No" label="Receive No :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Receive_Date" label="Date :">
                    <DatePicker className="myDatePicker" disabled style={{ background: "#f5f5f5"}}/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="Total_QTY" label="Total QTY :">
                    <Input style={{ textAlign: "right",background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={4}>
                  <Form.Item name="QR_Code1" label="QR Code Start :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="QR_Code2" label="QR Code End :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item label=" ">
                    <Button
                      type="primary"
                      className="btn-info"
                      style={{
                        marginBottom: 16,
                      }}
                      onClick={() => {
                        localStorage.setItem("qr", JSON.stringify(dataSourcePrint));

                        window.open(
                          `${
                            import.meta.env.VITE_APP_PUBLIC_URL
                          }${"/QrCodePrintAll"}`
                        );
                      }}
                      hidden={displayPrint}
                    >
                      <PrinterOutlined />
                      Print
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

            </Card>

            <Card>
              <div>
                <Table
                  bordered
                  dataSource={dataSource}
                  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                  columns={columns as ColumnTypes}
                  pagination={false}
                  scroll={{ y: 400 }}
                  footer={() => (
                    <div>
                      {"Total Qty : "}
                      {dataSource.length}
                    </div>
                  )}
                />

              </div>
            </Card>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default FormTag;
