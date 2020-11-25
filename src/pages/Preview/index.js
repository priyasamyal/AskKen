
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,Linking
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Icon,
  Textarea,
} from 'native-base';
// create a component
import { AppEventsLogger } from "react-native-fbsdk";
import { colors } from '../../common/index';
import { setTicketPhoto, setUserData } from "../../actions";
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import styles from './styles';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import commonData from '../../common/data.js';
import Modal from 'react-native-modal';
import SideMenu from '../../components/SideMenu';
import { SwipeableModal } from 'react-native-swipeable-modal';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  postApiRequestWithHeaders,
  openUrl,
  clearLocalStorage,
  showToast,
  errorHandler,
  postApiRequestWithHeadersServerEoor
} from '../../common/user';
import Video from 'react-native-video';
import { RNS3 } from 'react-native-aws3';
import { connect } from "react-redux";
import Load from 'react-native-loading-gif';
import CommonToast from "@custom_components/CommonToast";
 class Preview extends Component {

  constructor(props) {
		super(props);
		this.state = {
      paused: false,
      showCustomToast: false,
      type: "",
		};
		console.log(this.props,"props....")
  }
   
   	/**Common Toast Message*/
	callToastFunction = (msg, status) => {
		setTimeout(() => {
			this.setState({
				message: msg,
				type: status,
				showCustomToast: true
			})
		}, 400);

		setTimeout(() => {
			this.setState({
				showCustomToast: false
			});
		}, 3000);
	}
    navigator = (data) => {
        switch (data) {
          case "back":
            this.props.navigation.goBack();
            break;
          case "next":
            if(this.props.ticket_data.type =='photo'){
                  this.props.user.cards.length == 0 ?
                      this.props.navigation.navigate('OwnerPayment', {
                        view: "intro",
                        is_exist: false,
                        action: 'post_ticket'
                      }) : this.uploadPhoto();
                    if (this.props.user.cards.length != 0) {
                      this.refs.Load.OpenLoad();
                 }
            } else {
              this.setState({
                paused: true
              }) 
               this.props.user.cards.length == 0 ?
               this.props.navigation.navigate('OwnerPayment', {
              view: "intro",
              is_exist: false,
              action: 'post_ticket'
              }) : this.uploadVideo();
            }
            
            break; 
        
          default:
            break;
        }
      }

      uploadPhoto=()=>{
        var file_name = Date.now() + this.props.user.user_id + '.jpeg'
        this.props.setTicketPhoto({
          type: 'photo',
          uri: file_name
        })
        console.log("upload phot..", this.state);
        const file = {
          uri: this.props.ticket_data.uri,
          name: file_name,
          type: "image/jpeg"
        }
        const options = {
          keyPrefix: "uploads/",
          bucket: "askkenvideos",
          region: "us-east-2",
          accessKey: "AKIAX4SCEJIN7DVDY4AD",
          secretKey: "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",
          successActionStatus: 201
        }
        console.log(file,options);
        RNS3.put(file, options).then(response => {
          console.log(response, "S3 respo...")
          if (response.status !== 201) {
            this.refs.Load.CloseLoad();
            this.callToastFunction("Error Uploading Image. Try again later.", "error")
            throw new Error("Failed to upload image to S3");
           
          } else {
            this.props.setTicketPhoto({
              type: 'photo',
              uri: response.body.postResponse.location
            })
           this.createTicket()
        
          }
          console.log(response.body);
        });
      }

      uploadVideo = () => {
        this.refs.Load.OpenLoad();
        console.log("Upload video......");
        var file_name = Date.now() + this.props.user.user_id + '.mov'
        console.log("Upload video......",file_name);
        // this.props.setTicketPhoto({
        //   type: 'video',
        //   uri: file_name
        // })
        const file = {
          uri: this.props.ticket_data.uri,
          name: file_name,
          type: "video/mov"
        }
        const options = {
          keyPrefix: "uploads/",
          bucket: "askkenvideos",
          region: "us-east-2",
          accessKey: "AKIAX4SCEJIN7DVDY4AD",
          secretKey: "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",
          successActionStatus: 201
        }
        RNS3.put(file, options).then(response => {
          console.log(response, "S3 respo...")
          if (response.status !== 201) {
            this.refs.Load.CloseLoad();
            this.callToastFunction("Error Uploading Image. Try again later.", "error")
            throw new Error("Failed to upload image to S3");
           // this.refs.Load.CloseLoad();
          } else {
            this.props.setTicketPhoto({
              type: 'video',
              uri: response.body.postResponse.location
            })
            this.props.user.cards.length == 0 ?
              this.props.navigation.navigate('OwnerPayment', {
                view: "intro",
                is_exist: false,
                action: 'post_ticket'
              }) : this.createTicket()
          }
          console.log(response.body);
        });
      }

      createTicket = (param) => {
        console.log("create para", this.props.ticket_data, param);
        var param = {
          categories: this.props.ticket_data.categories,
          description: this.props.ticket_data.description,
          fees: "45",
          type: this.props.ticket_data.type,
          ticket_file: this.props.ticket_data.uri,
          card_id: this.props.user.cards[0].card_id
        }
        console.log(param, "parammmm123..........");
    
        postApiRequestWithHeadersServerEoor(commonData.api_endpoint.post_ticket, param, this.props.user.access_token).then(
          data => {
            AppEventsLogger.logEvent("Ticket Created", {type:'owner'});
            console.log(data, "post ticket.....");
            var user_data = this.props.user;
            user_data.cards = data.card;
            user_data.current_ticket = data.current_ticket;
            this.props.setUserData(user_data);
            this.refs.Load.CloseLoad();
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "HomePage" })],
            });
            this.props.navigation.dispatch(resetAction);
          },
          error => {
            console.log('error....', error);
            this.refs.Load.CloseLoad();
            errorHandler(error, this.props);
          },
        );
      }
    render() {
        return (
          <Container style={{ backgroundColor: colors.BLACK_TEXT }}>
            {this.state.showCustomToast ? (
					<View style={{
						position: "absolute",
						bottom: 0,
						zIndex: 2
					}}>
						<CommonToast type={this.state.type} message={this.state.message} />
					</View>
				) : null
				}
         <Load ref="Load"></Load>
        <Header transparent style={styles.header}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              hitSlop={hitSlop}
              onPress={() => this.navigator('back')}>
              <Icon style={[styles.black_text]} name="arrow-back" />
            </Button>
          </Left>
          <Body>  
          </Body>
          <Right>
           
          </Right>
        </Header>
            <View style={{alignItems:'center', flex:1, justifyContent:'space-between'}}>
                <View style={{flex:1, width:width}}>
                    {this.props.ticket_data.type=='photo'&&(
                      <Image
                         style={[styles.backgroundVideo,{ marginBottom:0}]} 
                          resizeMode="cover"
                          source={{
                            uri:this.props.ticket_data.uri
                          }} />  
                    )}
                     {this.props.ticket_data.type!='photo'&&(
                        <Video 
                        paused={this.state.paused}
                        resizeMode="cover"
                        source={{ uri:this.props.ticket_data.uri }}
                        style={[styles.backgroundVideo1,{ marginBottom:0}]} /> 
                    )}
                
                </View>
                
            <View style={styles.continueBtnContainer}>

            <Button
            onPress={() => {
                this.navigator("next")
            }}
            style={[styles.continueBtn, { backgroundColor: colors.LIGHT_COLOR, borderWidth: 1, borderColor: colors.btn_border }]} >
            <Text style={[styles.continueBtnTxt, { color: colors.BLACK_TEXT }]}>Next</Text>
            </Button>
            </View>
            </View>
            </Container>
            
        )
    }
}

function mapStateToProps(state) {
    console.log(state,"checking...")
    return {
      user: state.user.userData,
      ticket_data: state.post_ticket
    }
  }
  export default connect(mapStateToProps, { setTicketPhoto,setUserData})(Preview);
  
