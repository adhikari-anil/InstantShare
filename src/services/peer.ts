class PeerService {
  public _peer?: RTCPeerConnection;
  public dataChannel?: RTCDataChannel | null = null;
  public onDataChannel?: ((channel: RTCDataChannel) => void) | null = null;
  public isOfferCreated: boolean = false;

  constructor() {
    if (!this._peer) {
      this._peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
    }

    //For receiver-side data channel
    this._peer.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      if (this.onDataChannel) {
        this.onDataChannel(event.channel);
      }
    };
  }

  public onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    if (this._peer) {
      this._peer.onicecandidate = (e) => {
        if (e.candidate) {
          callback(e.candidate);
        }
      };
    }
  }

  public async addIceCandidate(candidate: RTCIceCandidate) {
    try {
      await this._peer?.addIceCandidate(candidate);
      console.log("Successfully added ICE candidate..");
    } catch (error) {
      console.log("Error Adding ICE candidate: ", error);
    }
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    if (this._peer) {
      await this._peer.setRemoteDescription(offer);
      const answer = await this._peer.createAnswer();
      await this._peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async getOffer() {
    if (!this._peer) return;
    if (this.isOfferCreated) {
      console.warn("Offer is already created...");
      return;
    }
    const offer = await this._peer.createOffer();
    await this._peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async setRemoteDescription(ans: RTCSessionDescriptionInit) {
    if (this._peer) {
      await this._peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  public async sendFile(file: File, chunkSize = 16 * 1024) {
    if (!this.dataChannel || this.dataChannel.readyState !== "open") {
      console.error("Data channel is not open.");
      return;
    }

    const dataChannel = this.dataChannel;
    const fileReader = new FileReader();
    let offset = 0;

    const totalChunks = Math.ceil(file.size / chunkSize);

    //send meta data first
    dataChannel.send(
      JSON.stringify({
        type: "file-meta",
        name: file.name,
        size: file.size,
        mime: file.type, // This is where image/png, application/pdf comes from
        done: true,
        totalChunks,
      })
    );
    console.log(
      `Starting to send file: ${file.name}, size: ${file.size}, chunks: ${totalChunks}`
    );

    const readSlice = (o: number) => {
      const slice = file.slice(offset, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    fileReader.onload = () => {
      if (fileReader.result) {
        dataChannel.send(fileReader.result as ArrayBuffer);
        offset += chunkSize;

        if (offset < file.size) {
          readSlice(offset);
        } else {
          console.log("File sending complete.");
        }
      }
    };

    fileReader.onerror = (err) => {
      console.error("File reading error:", err);
    };

    readSlice(0);
  }
}

export default new PeerService();
