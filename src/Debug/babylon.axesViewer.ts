/**
 * Module Debug contains the (visual) components to debug a scene correctly
 */
module BABYLON.Debug {

    /**
     * The Axes viewer will show 3 axes in a specific point in space
     */
    export class AxesViewer {
        private _xmesh: Nullable<AbstractMesh>;
        private _ymesh: Nullable<AbstractMesh>;
        private _zmesh: Nullable<AbstractMesh>;
        private _tmpVector = new BABYLON.Vector3();
        private _scaleLinesFactor = 4;
        /**
         * Gets the hosting scene
         */
        public scene: Nullable<Scene>;
        /**
         * Gets or sets a number used to scale line length
         */
        public scaleLines = 1;

        /** Gets the mesh used to render x-axis */
        public get xAxisMesh(): Nullable<AbstractMesh> {
            return this._xmesh;
        }

        /** Gets the mesh used to render x-axis */
        public get yAxisMesh(): Nullable<AbstractMesh> {
            return this._ymesh;
        }

        /** Gets the mesh used to render x-axis */
        public get zAxisMesh(): Nullable<AbstractMesh> {
            return this._zmesh;
        }

        private static _recursiveChangeRenderingGroupId(mesh: AbstractMesh, id: number) {
            mesh.renderingGroupId = id;
            mesh.getChildMeshes().forEach((m) => {
                AxesViewer._recursiveChangeRenderingGroupId(m, id);
            });
        }

        /**
         * Creates a new AxesViewer
         * @param scene defines the hosting scene
         * @param scaleLines defines a number used to scale line length (1 by default)
         */
        constructor(scene: Scene, scaleLines = 1) {
            this.scaleLines = scaleLines;

            var greenColoredMaterial = new BABYLON.StandardMaterial("", scene);
            greenColoredMaterial.disableLighting = true;
            greenColoredMaterial.emissiveColor = BABYLON.Color3.Green().scale(0.5);

            var redColoredMaterial = new BABYLON.StandardMaterial("", scene);
            redColoredMaterial.disableLighting = true;
            redColoredMaterial.emissiveColor = BABYLON.Color3.Red().scale(0.5);

            var blueColoredMaterial = new BABYLON.StandardMaterial("", scene);
            blueColoredMaterial.disableLighting = true;
            blueColoredMaterial.emissiveColor = BABYLON.Color3.Blue().scale(0.5);

            this._xmesh = BABYLON.AxisDragGizmo._CreateArrow(scene, redColoredMaterial);
            this._ymesh = BABYLON.AxisDragGizmo._CreateArrow(scene, greenColoredMaterial);
            this._zmesh = BABYLON.AxisDragGizmo._CreateArrow(scene, blueColoredMaterial);

            this._xmesh.rotationQuaternion = new BABYLON.Quaternion();
            this._xmesh.scaling.setAll(this.scaleLines * this._scaleLinesFactor);
            this._ymesh.rotationQuaternion = new BABYLON.Quaternion();
            this._ymesh.scaling.setAll(this.scaleLines * this._scaleLinesFactor);
            this._zmesh.rotationQuaternion = new BABYLON.Quaternion();
            this._zmesh.scaling.setAll(this.scaleLines * this._scaleLinesFactor);

            AxesViewer._recursiveChangeRenderingGroupId(this._xmesh, 2);
            AxesViewer._recursiveChangeRenderingGroupId(this._ymesh, 2);
            AxesViewer._recursiveChangeRenderingGroupId(this._zmesh, 2);

            this.scene = scene;
            this.update(new BABYLON.Vector3(), Vector3.Right(), Vector3.Up(), Vector3.Forward());
        }

        /**
         * Force the viewer to update
         * @param position defines the position of the viewer
         * @param xaxis defines the x axis of the viewer
         * @param yaxis defines the y axis of the viewer
         * @param zaxis defines the z axis of the viewer
         */
        public update(position: Vector3, xaxis: Vector3, yaxis: Vector3, zaxis: Vector3): void {
            if (this._xmesh) {
                this._xmesh.position.copyFrom(position);
                xaxis.scaleToRef(-1, this._tmpVector);
                this._xmesh.setDirection(this._tmpVector);
                this._xmesh.scaling.setAll(this.scaleLines * this._scaleLinesFactor);
            }
            if (this._ymesh) {
                this._ymesh.position.copyFrom(position);
                yaxis.scaleToRef(-1, this._tmpVector);
                this._ymesh.setDirection(this._tmpVector);
                this._ymesh.scaling.setAll(this.scaleLines * this._scaleLinesFactor);
            }
            if (this._zmesh) {
                this._zmesh.position.copyFrom(position);
                zaxis.scaleToRef(-1, this._tmpVector);
                this._zmesh.setDirection(this._tmpVector);
                this._zmesh.scaling.setAll(this.scaleLines * this._scaleLinesFactor);
            }

        }

        /** Releases resources */
        public dispose() {

            if (this._xmesh) {
                this._xmesh.dispose();
            }

            if (this._ymesh) {
                this._ymesh.dispose();
            }

            if (this._zmesh) {
                this._zmesh.dispose();
            }

            this._xmesh = null;
            this._ymesh = null;
            this._zmesh = null;

            this.scene = null;
        }

    }
}