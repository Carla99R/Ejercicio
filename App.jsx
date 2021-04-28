import { StatusBar } from 'expo-status-bar';
import React, {Component, useState} from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    PixelRatio
} from 'react-native';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            imagenes: [],
            url: 'https://picsum.photos/v2/list?page=1',
            id: "",
            author: "",
            width: "",
            height: "",
            url1: "",
            download_url: "",
            modalVisible: false,
            noImgVisible:false,
            i:2
        }
    }

    componentDidMount() {
        this.getImagenes();
    }

    getImagenes = async() => {

        await fetch(this.state.url)
            .then(res => res.json())
            .then(res => {
                 if(res.length > 0){
                     this.setState({
                     imagenes: this.state.imagenes.concat(res),
                     loading: false,
                     url: `https://picsum.photos/v2/list?page=${this.state.i}`
                    })
                 }else{
                     this.setState({loading: false})
                     this.setState({noImgVisible: true})
                 }
            })
            console.log(this.state.url)

    };


    informacion = async(id) => {
        const u = `https://picsum.photos/id/${id}/info`;

        fetch(u)
            .then(res => res.json())
             .then(res => {
                 this.setState({
                 id: res.id,
                 author: res.author,
                 width: res.width,
                 height: res.height,
                 url1: res.url,
                 download_url: res.download_url,
                 modalVisible: true
                })
            })

    };

     handleLoadMore = () => {
        this.setState({
            i: this.state.i +1

            },
            this.getImagenes)

      };


    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text>Descargando Imagenes...</Text>
                    <StatusBar style="auto"/>
                </View>
            );
        }

        if(this.state.noImgVisible){
            return (
                <View style={styles.container}>
                    <Text>No hay más imagenes</Text>
                    <StatusBar style="auto"/>
                </View>
            );
        }

        return (
            <>
                <View style={[styles.i]}>
                    <View style={[styles.i]}>
                        <FlatList
                        data={this.state.imagenes}
                        numColumns={3}
                        renderItem={
                            ({item}) =>
                                <TouchableOpacity activeOpacity={.5} onPress={()=>{this.informacion(item.id)}}>
                                      <Image
                                          style={styles.img}
                                          source={{uri: item.download_url}}

                                      >
                                      </Image>

                                </TouchableOpacity>

                        }

                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={1}
                    >

                    </FlatList>

                    </View>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({modalVisible: false})
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Información de la imagen</Text>
                                <Text style={styles.modalText}>Id: {this.state.id}</Text>
                                <Text style={styles.modalText}>Autor: {this.state.author}</Text>
                                <Text style={styles.modalText}>Ancho: {this.state.width}</Text>
                                <Text style={styles.modalText}>Largo: {this.state.height}</Text>
                                <Text style={styles.modalText}>Url: {this.state.url}</Text>
                                <Text style={styles.modalText}>Url de descarga: {this.state.download_url}</Text>

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        this.setState({modalVisible: false})
                                    }}
                                >
                                    <Text style={styles.textStyle}>Cerrar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                </View>

            </>

        );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgs: {
    paddingLeft: 15,
    backgroundColor: 'powderblue',

  },
  img: {
    width: PixelRatio.getPixelSizeForLayoutSize(55),
    height: PixelRatio.getPixelSizeForLayoutSize(55)

  },
    i: {
    display: 'flex',
    backgroundColor: '#333',

  },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


