//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { colors } from '../../common/index';
var { width, height } = Dimensions.get('window');
import { connect } from "react-redux";
import {
    Container,
    Header,
    Content,
    Left,
    Button,
    Body,
    Right,
    Icon,
    Title,
    Item,
    Input,
    Col,
    Grid,
    Label,
    ListItem,
    CheckBox,
    Footer,
} from 'native-base';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import commonData from '../../common/data.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { showToast, alertWithSingleBtn } from '../../common/user';
import styles from './styles';

// create a component
var name;
var cvvNumber;
class ExpertExistCard extends Component {
    constructor(props) {
        super(props);
        // console.log(props, 'props in card ');
        this.state = {
            date: '',
            mode: 'date',
            expiration_month: '',
            expiration_year: '',
            show: false,
            dateText: 'Expiration',
            cardNumber: '',
            cardHolderName: '',
            cvv: '',
            billingZip: '',
            startYear: new Date().getFullYear(),
            endYear: 2085,
            selectedYear: '',
            selectedMonth: '',
            is_exist: this.props.is_exist,
            //is_exist: true,
            cards: this.props.user.cards,
            //  replaceText: this.props.replaceText,
            replaceText: 'Replace Card',
            useExistingText: 'Use Existing Card',
            showNext: this.props.showNext,
            replaceCard: this.props.replaceCard,
            //replaceCard: 'Replace Existing Card',
            isReplaced: false,
            is_connected: false
        };
    }
    componentDidMount() {
        if (this.props.user.user_type == 'expert' && this.props.user.cards.length > 0) {
            console.log(commonData.stripe_status);
            if (commonData.stripe_status.errors.length == 0 && commonData.stripe_status.charge_enabled == 1 && commonData.stripe_status.transfer_enabled == null) {
                alertWithSingleBtn(
                    '',
                    commonData.ToastMessages.pending_transfered_enable,
                    'Ok',
                ).then(data => {
                });

            }
            if (commonData.stripe_status.errors.length > 0) {
                var err = commonData.stripe_status.errors.find(ind => {
                    return ind == "id_number";
                })
                if (err) {
                    alertWithSingleBtn(
                        'Full SSN Required',
                        commonData.ToastMessages.full_ssn_prompt,
                        'Enter SSN',
                    ).then(data => {
                        if (data) {
                            const param = {
                                card_id: this.state.cards[0].card_id,
                                user_id: this.props.user.user_id,
                            };
                            param.street = this.props.user.cards[0].street;
                            param.city = this.props.user.cards[0].city;
                            param.state = this.props.user.cards[0].state;
                            param.zip = this.props.user.cards[0].zip;
                            param.business_type = this.props.user.cards[0].business_type;
                            param.phone = this.props.user.cards[0].phone;
                            param.email = this.props.user.cards[0].email;
                            this.props.handler('AddSSN', param);
                        }
                    });
                }
                else if (commonData.stripe_status.errors.length == 1 && commonData.stripe_status.errors[0] == "document" && commonData.stripe_status.charge_enabled == null) {
                    alertWithSingleBtn(
                        'Verification Pending',
                        commonData.ToastMessages.review_msg,
                        'Ok',
                    ).then(data => {
                        if (data) {

                        }
                    });
                }

                else {
                    var err = undefined;
                    console.log(err, "initi")
                    var err = commonData.stripe_status.errors.find(ind => {
                        if (ind == "city" || ind == "state" || ind == "postal_code" || ind == "line1") {
                            return ind
                        }
                    })

                    console.log(err, "final err");
                    if (err) {
                        alertWithSingleBtn(
                            'Review Address',
                            commonData.ToastMessages.card_holder_info_error,
                            'Review',
                        ).then(data => {
                            console.log(data);
                            if (data) {
                                //  openUrl('https://www.askkenapp.com/terms');
                                const param = {
                                    card_id: this.state.cards[0].card_id,
                                    user_id: this.props.user.user_id,
                                };

                                this.props.handler('AddCardHolder', param);
                            }
                        });
                    }
                }
                console.log(err, "err....");

            }

        }
    }
    navigator = navigateTo => {
        const namePattern = /^[a-zA-Z. ]+$/;
        name = namePattern.test(this.state.cardHolderName);
        switch (navigateTo) {

            case "edit_payout": {
                const param = {
                    card_id: this.state.cards[0].card_id,
                    user_id: this.props.user.user_id,
                    is_exist: true
                };
                this.props.handler('AddCardHolder', param);
                break;
            }
            case "replace_card": {
                const param = {
                    card_id: this.state.cards[0].card_id,
                    user_id: this.props.user.user_id,
                    is_exist: false
                };
                this.props.handler('expertCard', param);
                break;
            }
            case 'next': {
                console.log('next');
                if (this.state.is_exist) {
                    const param = {
                        card_id: this.state.cards[0].card_id,
                        user_id: this.props.user.user_id,
                    };
                    if (this.props.user.user_type == 'owner') {
                        if (!this.state.is_connected) {
                            
                            this.props.handler('addCard', param);
                        }

                    } else {
                        param.is_exist = true
                        this.props.handler('AddCardHolder', param);
                    }
                } else {

                    if (this.state.cardHolderName.length < 2) {
                        showToast(commonData.ToastMessages.card_holder_name);
                        return false;
                    }
                   
                    else if (!this.state.cardNumber) {
                        showToast(commonData.ToastMessages.card_number);
                        return false;
                    }
                    else if (this.state.cardNumber.length < 18) {
                        showToast(commonData.ToastMessages.valid_card);
                        return false;
                    } else if (this.state.selectedYear == '') {
                        showToast(commonData.ToastMessages.expiration);
                        return false;
                    } else if (this.state.cvv.length < 3) {
                        showToast(commonData.ToastMessages.cvv);
                        return false;
                    } else if (this.state.billingZip.length < 2) {
                        showToast(commonData.ToastMessages.zip);
                        return false;
                    } else {
                        // console.log('api callll');
                        const param = {
                            user_id: this.props.user.user_id,
                            card_number: this.state.cardNumber,
                            cvv: this.state.cvv,
                            // card_holder_name: this.state.cardHolderName,
                            expiration_month: this.state.selectedMonth,
                            expiration_year: this.state.selectedYear,
                            billing_zip: this.state.billingZip,
                        };
                        if (this.state.cards.length > 0) {
                            param.is_saved = this.state.isReplaced;
                            // param.card_id = this.state.cards[0].card_id;
                        }
                        if (this.props.user.user_type == 'owner') {
                            param.card_holder_name = this.state.cardHolderName;
                            this.props.handler('addCard', param);
                        } else {
                            param.card_holder_name = this.state.cardHolderName;
                            this.props.handler('AddCardHolder', param);                          
                        }
                        console.log(param, 'param in add card ');
                    }
                }

                break;
            }
            case 'work': {
                this.props.handler('work');
                break;
            }

            case 'back': {
                this.props.handler('back');
                break;
            }
        }
    };
    //Function to toggle view  for saved card and add new card
    checkExistCard() {
        console.log('is Esitin');
        this.setState({ is_exist: !this.state.is_exist });
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Header transparent style={styles.header}>
                    <Left>
                        <Button
                            transparent
                            hitSlop={hitSlop}
                            onPress={() => this.navigator('back')}>
                            <Icon style={[styles.black_text]} name="arrow-back" />
                        </Button>
                    </Left>
                    <Body></Body>
                    <Right style={{ flex: 3 }}>
                        <TouchableOpacity onPress={() => this.navigator('work')}>
                            <Title style={styles.pageTitle}>
                                {this.props.user.user_type == 'owner'
                                    ? 'Is my info secure?'
                                    : 'How does this work?'}
                            </Title>
                        </TouchableOpacity>
                    </Right>
                </Header>

                <View style={styles.mainContent}>
                    <View style={styles.mainContainer}>
                        {this.state.cards.length > 0
                            && (
                                <View
                                    style={
                                        {
                                            margin: 20,
                                        }
                                    }>
                                    <Label style={styles.headingText}>Card saved</Label>
                                    <View
                                        style={[
                                            styles.existingCardContainer,
                                            {
                                                borderColor:
                                                    this.state.is_exist == true
                                                        ? colors.THEME_YELLOW
                                                        : colors.BORDER_COLOR,
                                            },
                                        ]}>
                                        <ListItem noBorder>
                                            <CheckBox
                                                checked={this.state.is_exist}
                                                onPress={() => this.checkExistCard()}
                                                color={colors.THEME_YELLOW}
                                            />
                                            <Body>
                                                <Text
                                                    onPress={() => this.checkExistCard()}
                                                    style={styles.existingCardText}>
                                                    XXXX-XXXX-XXXX-
                            <Text style={{ fontWeight: 'bold' }}>
                                                        {this.state.cards[0].card_number}
                                                    </Text>
                                                </Text>
                                            </Body>
                                        </ListItem>
                                    </View>
                                </View>
                            )}
                        <View style={styles.btncontainer}>
                            <Button
                                transparent
                                block
                                onPress={() => this.navigator('edit_payout')}
                                style={styles.btn_inner}>
                                <Text style={styles.btn_txt}>Edit Payout Info</Text>
                            </Button>
                            <Button
                                transparent
                                block
                                onPress={() => this.navigator('replace_card')}
                                style={styles.btn_inner}>
                                <Text style={styles.btn_txt}>Replace Card</Text>
                            </Button>
                        </View>

                    </View>
                </View>

            </Container>
        );
    }
}

function mapStateToProps(state) {
    console.log(state, "state in pay")
    return {
        user: state.user.userData
    }
}
export default connect(mapStateToProps, {})(ExpertExistCard);

