import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';
import { CONSTANTS, processParams } from 'cloudimage-responsive-utils';


export const CloudimageContext = React.createContext({ cloudImageConfig: {} });


class CloudimageProvider extends Component {
  constructor({ config = {} } = {}) {
    super();

    const {
      token = '',
      domain = config.customDomain || 'cloudimg.io',
      customDomain = false,
      lazyLoading = true,
      lazyLoadOffset = 100,
      placeholderBackground = '#f4f4f4',
      baseUrl, // to support old name
      baseURL,
      apiVersion = 'v7',
      presets,
      ratio = 1.5,
      params = 'org_if_sml=1',
      imageSizeAttributes = 'use',
      exactSize = false,
      doNotReplaceURL = false,
      limitFactor = 100,
      devicePixelRatioList = CONSTANTS.DEVICE_PIXEL_RATIO_LIST,
      lowQualityPreview: {
        minImgWidth = 250
      } = {},
      autoAlt = false
    } = config;

    this.state = {
      token,
      domain,
      customDomain,
      lazyLoading,
      lazyLoadOffset,
      placeholderBackground,
      baseURL: baseUrl || baseURL,
      ratio,
      exactSize,
      presets: presets ? presets :
        {
          xs: '(max-width: 575px)',  // to 575       PHONE
          sm: '(min-width: 576px)',  // 576 - 767    PHABLET
          md: '(min-width: 768px)',  // 768 - 991    TABLET
          lg: '(min-width: 992px)',  // 992 - 1199   SMALL_LAPTOP_SCREEN
          xl: '(min-width: 1200px)'  // from 1200    USUALSCREEN
        },
      params: processParams(params),
      apiVersion,
      innerWidth: typeof window !== 'undefined' ? window.innerWidth : null,
      previewQualityFactor: 10,
      doNotReplaceURL,
      devicePixelRatioList,
      limitFactor,
      minLowQualityWidth: minImgWidth,
      imageSizeAttributes,
      autoAlt
    };

    if (typeof window !== 'undefined') {
      this.state.innerWidth = window.innerWidth;
      window.addEventListener("resize", this.updateDimensions);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.updateDimensions);
    }
  }

  updateDimensions = debounce(100, () => {
    this.setState({ innerWidth: window.innerWidth });
  });

  render() {
    return (
      <CloudimageContext.Provider value={{ cloudImageConfig: this.state }}>
        {this.props.children}
      </CloudimageContext.Provider>
    )
  }
}

export default CloudimageProvider;
