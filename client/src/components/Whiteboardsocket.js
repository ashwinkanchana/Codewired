import { produce } from "immer";
import React from "react";
import { Canvas, CanvasPath, Point } from "react-sketch-canvas";
import { getsocketIoInstance } from '../utils/socketio-client';


const defaultProps = {
    width: "70vw",
    height: "70vh",
    className: "socketCanvas",
    canvasColor: "white",
    strokeColor: "red",
    background: "",
    strokeWidth: 4,
    eraserWidth: 20,
    allowOnlyPointerType: "all",
    style: {
        border: "0.0625rem solid #9c9c9c",
        borderRadius: "0.25rem",
    }
};

/* Props validation */


export default class Whiteboardsocket extends React.Component {
    static defaultProps = defaultProps;

    initialState = {
        drawMode: true,
        isDrawing: false,
        resetStack: [],
        undoStack: [],
        currentPaths: [],
        eraseMode: false
    };
    

    constructor(props) {
        super(props);

        this.state = this.initialState;

        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);

        this.eraseMode = this.eraseMode.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.resetCanvas = this.resetCanvas.bind(this);

        this.liftPathsUp = this.liftPathsUp.bind(this);

        this.svgCanvas = React.createRef();

        this.roomName = sessionStorage.getItem('roomName');
        this.displayName = sessionStorage.getItem('displayName');
        this.socketIo = getsocketIoInstance(this.roomName, this.displayName, 'Whiteboard');
    }

    componentDidMount() {
        this.socketIo.on('whiteboard-paths', ({ currentPaths, isDrawing }) => {
            // update paths
            this.setState({
                // currentPaths: fromJS(currentPaths),
                currentPaths,
                isDrawing
            });
        });

        // this.socketIo.on('sketch-undo', () => {
        //   this.undo();
        // });
        // this.socketIo.on('sketch-redo', () => {
        //   this.redo();
        // });
        // this.socketIo.on('sketch-clear', () => {
        //   // this.clearCanvas();
        //   this.resetCanvas();
        // });
    }

    resetCanvas() {
        this.setState(this.initialState);
    }

    liftPathsUp() {
        const { currentPaths } = this.state;
        const { onUpdate } = this.props;

        onUpdate(currentPaths);
    }

    /* Mouse Handlers - Mouse down, move and up */

    handlePointerDown(point) {
        this.socketIo.emit("sketchPointerDown", { roomName: this.roomName, point, toDraw: !this.state.eraseMode });
    }

    handlePointerMove(point) {
        this.socketIo.emit("sketchPointerMove", { roomName: this.roomName, point, toDraw: !this.state.eraseMode });
    }

    handlePointerUp() {
        this.socketIo.emit("sketchPointerUp", { roomName: this.roomName });
    }

    /* Mouse Handlers ends */

    /* Canvas operations */

    eraseMode(erase) {
        this.setState(
            produce((draft) => {
                draft.drawMode = !erase;
            }),
            this.liftPathsUp
        );
    }
    toggleEraseMode = () => {
        this.eraseMode(!this.state.eraseMode);
        this.setState({ eraseMode: !this.state.eraseMode })
    }

    clearCanvas() {
        this.setState(
            produce((draft) => {
                draft.resetStack = draft.currentPaths;
                draft.currentPaths = [];
            }),
            this.liftPathsUp
        );
        this.socketIo.emit("sketch-clear", { roomName: this.roomName });
    }

    undo() {
        const { resetStack } = this.state;

        // If there was a last reset then
        if (resetStack.length !== 0) {
            this.setState(
                produce((draft) => {
                    draft.currentPaths = draft.resetStack;
                    draft.resetStack = [];
                }),
                () => {
                    const { currentPaths } = this.state;
                    const { onUpdate } = this.props;

                    onUpdate(currentPaths);
                }
            );
            this.socketIo.emit("sketch-undo", { roomName: this.roomName });
            return;
        }

        this.setState(
            produce((draft) => {
                const lastSketchPath = draft.currentPaths.pop();

                if (lastSketchPath) {
                    draft.undoStack.push(lastSketchPath);
                }
            }),
            this.liftPathsUp
        );
        this.socketIo.emit("sketch-undo", { roomName: this.roomName });
    }

    redo() {
        const { undoStack } = this.state;

        // Nothing to Redo
        if (undoStack.length === 0) return;

        this.setState(
            produce((draft) => {
                const lastUndoPath = draft.undoStack.pop();

                if (lastUndoPath) {
                    draft.currentPaths.push(lastUndoPath);
                }
            }),
            this.liftPathsUp
        );
        this.socketIo.emit("sketch-redo", { roomName: this.roomName });
    }

    /* Finally!!! Render method */

    render() {
        const {
            width,
            height,
            className,
            canvasColor,
            background,
            style,
            allowOnlyPointerType,
        } = this.props;

        const { currentPaths, isDrawing } = this.state;

        return (
            <div className="whiteboard">
                <h4>Whiteboard</h4>
                {/* <h4>Doodle</h4> */}
                <div className="whiteboard-icons">
                    {/* <i className="fas fa-undo" data-tip='Undo' onClick={this.undo} data-for="whtbrd-tltp"></i>
          <i className="fas fa-redo" data-tip='Redo' onClick={this.redo} data-for="whtbrd-tltp"></i> */}
                    <i className="fas fa-eraser" data-tip={this.state.eraseMode ? 'Stop Erase' : 'Erase'}
                        onClick={this.toggleEraseMode} data-for="whtbrd-tltp"></i>
                    <i className="fas fa-broom" data-tip='Clear' onClick={this.clearCanvas} data-for="whtbrd-tltp"></i>
                </div>
                <Canvas
                    ref={this.svgCanvas}
                    width={width}
                    height={height}
                    className={className}
                    canvasColor={canvasColor}
                    background={background}
                    allowOnlyPointerType={allowOnlyPointerType}
                    style={style}
                    paths={currentPaths}
                    isDrawing={isDrawing}
                    onPointerDown={this.handlePointerDown}
                    onPointerMove={this.handlePointerMove}
                    onPointerUp={this.handlePointerUp}
                />
            </div>
        );
    }
}