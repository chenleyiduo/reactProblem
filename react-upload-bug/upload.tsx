import { Button, Col, Descriptions, Icon, message, Modal, Row, Spin, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import identityStyle from './upload.less';

const getBase64 = (file: any) => {
  return new Promise((resolve: any, reject: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error: any) => reject(error);
  });
};
/**
 * 身份证返回的数据对象
 */
type user = {
  name: string,
    sex: string,
    nation: string,
    birth: string,
    addr: string,
    idno: string
}

const IdentityIndex = (props: {
  isShow: boolean;
  data: any;
  isOpenFun: React.Dispatch<React.SetStateAction<any>>;
}) => {
  /**
   * 从父组件传过来的属性，isShow是否展示认证框，data：agent数据，isOpenFun设置展示认证框的值
   */
  const { isShow, data, isOpenFun } = props;
  /**  上传的图片第一张  */
  const [fileFirstList, setFileFirstList] = useState([]);
  /**  上传的图片第二张  */
  const [fileSecondList, setFileSecondList] = useState([]);
  /** 是否打开预览图片 */
  const [previewVisible, setPreviewVisible] = useState(false);
  /** 预览的图片数据 */
  const [previewImage, setPreviewImage] = useState();
  /** 加载框 */
  const fileFormatIsTrue = useRef(true)
  const [preLookImg,setPreLookImg] = useState(false)

  /**
   * 预览图片
   * @param file 
   */
  const handlePreview = async (file: any) => {
    if (!file?.url && !file?.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  /**
   * 图片修改的时候更改fileFirst
   * @param param0 
   */
  const handleChangeFirst = ({ fileList }: any) => {
    if(fileFormatIsTrue.current){
      setFileFirstList(fileList)
    }
  };

  /**
   * 图片修改的时候更改fileSecond
   * @param param0 
   */
  const handleChangeSecond = ({ fileList }: any) => {
    if(fileFormatIsTrue.current){
      setFileSecondList(fileList)
    }
  };

  /**
   * 关闭 预览图片
   * @returns 
   */
  const handleCancel = () => setPreviewVisible(false);


  const beforeUpload = (file: any) => {
    fileFormatIsTrue.current = true
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 < 100;
    if (!isLt2M) {
      message.error('图片必须小于100kb!');
    }
    fileFormatIsTrue.current = isJpgOrPng && isLt2M
    return isJpgOrPng && isLt2M;
  }

  
  


  /**
   * 上传的按钮
   * @returns 
   */
  const uploadButton = (pagenumber: number) => {
    return (
      <div className={pagenumber===1?identityStyle['img-first-back']:identityStyle['img-second-back']}>
        <div style={{width:'100%',height:'100%',backgroundColor:'rgba(255, 255, 255, 0.8)'}}>
        <Icon type="plus" style={{ fontSize: '32px',marginTop:'70px' }} />
        <div className="ant-upload-text">上传图片/{pagenumber===1?'上传国徽面':'上传人像面'}</div>
        <div className="ant-upload-text">仅支持*.jpg、*.png，图片&lt;100kb</div>
        </div>
      </div>
    );
  };


  /**
   * 第一步
   * @returns
   */
  const firstStep = () => {
    return (
      <div>
        <Row>
          <Col span={12} className="upload-identity-img">
            <div className="clearfix">
              <Upload
                listType="picture-card"
                fileList={fileFirstList}
                onPreview={handlePreview}
                onChange={handleChangeFirst}
                beforeUpload={beforeUpload}
              >
                {fileFirstList.length >= 1 ? null : uploadButton(1)}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          </Col>
          <Col span={12} className="upload-identity-img">
          <Upload
                listType="picture-card"
                fileList={fileSecondList}
                onPreview={handlePreview}
                onChange={handleChangeSecond}
                beforeUpload={beforeUpload}
              >
                {fileSecondList.length >= 1 ? null : uploadButton(2)}
              </Upload>
          </Col>
        </Row>
      </div>
    );
  };


  const openFormat = ()=>{
    setPreLookImg(true)
  }

  return (
    <div>
      
      <Modal
        visible={isShow}
        title={<span>{data?.systemCode}系统{data?.agentNo}账号身份认证  <Icon type="info-circle" style={{color: '#096dd9'}} onClick={openFormat}/></span>}
        onCancel={() => {
          isOpenFun(false);
        }}
        footer={null}
        width={700}
        maskClosable={false}
      ><Spin tip="Loading..." spinning={false}>
        {firstStep()}
        <Modal visible={preLookImg} title="身份证样例" footer={null} onCancel={()=>{setPreLookImg(false)}}>
                <img alt="example" style={{ width: '100%' }} src={require('./img/3324.jpg')} />
        </Modal>
      </Spin>
      </Modal>
    </div>
  );
};

export default IdentityIndex;
