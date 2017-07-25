import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight,
    Alert,
    AsyncStorage
} from 'react-native';
const STORAGE_KEY = 'game:data'
var timeLimit = 30;
var timer = null;
var Devil = React.createClass({
    render() {
        return (
            <TouchableHighlight style={styles.touch}
                onPress={this.props.onPress}>
                <Text style={styles.devil}>{this.props.show ? '🐳' : ''}</Text>
            </TouchableHighlight >
        )
    }
})
export default class game extends Component {
    constructor() {
        super();
        this.state = {
            highScore: 0,
            timeCount: 0,
            score: 0,
            playing: false,
            holes: [false, false, false, false, false, false, false, false, false],
            val: 0,
        }
        this.save = this.save.bind(this);
    }

    save() {
        AsyncStorage.setItem(STORAGE_KEY, this.state.highScore + '')
            .then(() => console.log('saved'))
            .catch((error) => console.log(error.message)).done();
    }
    componentDidMount() {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((value) => {
                this.setState({
                    highScore: value,
                })
            }).catch((error) => console.log('AsyncStorage:' + error.message))
    }
    _startGame() {
        this.setState({
            timeCount: timeLimit,
            playing: true,
            score: 0,
        });
        devil = setInterval(() => {
            var currentHoles = this.state.holes;
            currentHoles[Math.floor(Math.random() * 9)] = true;
            if (!Math.floor(Math.random() * 3)) {
                currentHoles = [false, false, false, false, false, false, false, false, false]
            }
            this.setState({
                holes: currentHoles,
            })
            if (!this.state.playing) {
                clearInterval(devil);
                this.setState({
                    holes: [false, false, false, false, false, false, false, false, false]
                })
            }
        }, 500);
        timer = setInterval(() => {
            this.setState({
                timeCount: this.state.timeCount - 1,
            });
            if (this.state.timeCount == 0) {
                this._stopGame();
            }
        }, 1000);
    }
    _stopGame() {
        if (this.state.score > this.state.highScore) {
            Alert.alert(
                'New High Score!!',
                'Congratulation! you have got new high score ( ' + this.state.score + ' )',
                [

                    { text: 'CLOSE', onPress: () => console.log('CLOSE') },
                ],
                { cancelable: false }
            )
        }
        clearInterval(timer);
        this.setState({
            playing: false,
            highScore: (this.state.score > this.state.highScore) ? this.state.score : this.state.highScore,
        })
        this.save();
    }
    _handleTouch(holeNumber) {
        if (this.state.holes[holeNumber]) {
            this.setState({
                score: this.state.score + 1,
                holes: this.state.holes == false,
            })
        }

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.scoreRow}>
                    <View style={styles.highScore}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>High Score</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>{this.state.highScore}</Text>
                    </View>
                    <View style={styles.timeCount}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Time</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>{this.state.timeCount}</Text>
                    </View>
                    <View style={styles.currentScore}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Score</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>{this.state.score}</Text>
                    </View>
                </View>

                <View style={styles.holesRow}>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[0]}
                            onPress={() => this._handleTouch(0)} />
                    </View>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[1]}
                            onPress={() => this._handleTouch(1)} />
                    </View>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[2]}
                            onPress={() => this._handleTouch(2)} />
                    </View>
                </View>
                <View style={styles.holesRow}>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[3]}
                            onPress={() => this._handleTouch(3)} />
                    </View>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[4]}
                            onPress={() => this._handleTouch(4)} />
                    </View>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[5]}
                            onPress={() => this._handleTouch(5)} />
                    </View>
                </View>
                <View style={styles.holesRow}>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[6]}
                            onPress={() => this._handleTouch(6)} />
                    </View>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[7]}
                            onPress={() => this._handleTouch(7)} />
                    </View>
                    <View style={styles.holes}>
                        <Devil show={this.state.holes[8]}
                            onPress={() => this._handleTouch(8)} />
                    </View>
                </View>
                <View style={styles.button}>
                    <View style={styles.buttonRow}>
                        <Button
                            title="Start Game"
                            color="teal"
                            onPress={this._startGame.bind(this)}
                            disabled={this.state.playing} />
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },
    scoreRow: {
        flex: 1,
        backgroundColor: 'grey',
        flexDirection: 'row',
    },
    highScore: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
    },
    timeCount: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
    },
    currentScore: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
    },
    holesRow: {
        backgroundColor: 'white',
        flex: 2,
        flexDirection: 'row',
    },
    buttonRow: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        flexDirection: 'row',
    }
    ,
    holes: {
        borderWidth: 2,
        borderColor: 'grey',
        flex: 1,
        backgroundColor: 'darkgrey',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    devil: {
        fontSize: 70,

    },
    touch: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})