import {Image, Upload, UploadFile, UploadProps} from 'antd';
import block from 'bem-cn-lite';
import {useState} from 'react';
import {Fragment} from 'react/jsx-runtime';

import {getBase64} from '@/shared/utils/processFile';
import {FileType} from '@/typings/file';
import './ImageUpload.scss';

const b = block('image-upload');

export const ImageUpload = () => {
    const [previewOpen, setPreviewOpen] = useState(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) =>
        setFileList(newFileList);
    return (
        <Fragment>
            <Upload
                action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                listType='picture-circle'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    styles={{root: {display: 'none'}}}
                    preview={{
                        open: previewOpen,
                        onOpenChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Fragment>
    );
};
