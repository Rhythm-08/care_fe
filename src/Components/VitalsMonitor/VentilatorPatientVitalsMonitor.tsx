import { useEffect } from "react";
import { PatientAssetBed } from "../Assets/AssetTypes";
import { Link } from "raviger";
import { GENDER_TYPES } from "../../Common/constants";
import CareIcon from "../../CAREUI/icons/CareIcon";
import useVentilatorVitalsMonitor from "./useVentilatorVitalsMonitor";
import { VitalsValueBase } from "./types";
import { classNames } from "../../Utils/utils";
import WaveformLabels from "./WaveformLabels";

interface Props {
  patientAssetBed?: PatientAssetBed;
  socketUrl: string;
  size?: { width: number; height: number };
}

export default function VentilatorPatientVitalsMonitor({
  patientAssetBed,
  socketUrl,
  size,
}: Props) {
  const { connect, waveformCanvas, data, isOnline } =
    useVentilatorVitalsMonitor();
  const { patient, bed } = patientAssetBed ?? {};

  useEffect(() => {
    connect(socketUrl);
  }, [socketUrl]);

  return (
    <div className="flex flex-col gap-1 rounded bg-[#020617] p-2">
      {patientAssetBed && (
        <div className="flex items-center justify-between px-2 tracking-wide">
          <div className="flex items-center gap-2">
            {patient ? (
              <Link
                href={`/facility/${patient.last_consultation?.facility}/patient/${patient.id}/consultation/${patient.last_consultation?.id}`}
                className="font-bold uppercase text-white"
              >
                {patient?.name}
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-500">
                <CareIcon className="care-l-ban" />
                No Patient
              </span>
            )}
            {patient && (
              <span className="text-sm font-bold text-gray-400">
                {patient.age}y;{" "}
                {GENDER_TYPES.find((g) => g.id === patient.gender)?.icon}
              </span>
            )}
          </div>
          {bed && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CareIcon className="care-l-bed text-base" />
                {bed.name}
              </span>
              <span className="flex items-center gap-1">
                <CareIcon className="care-l-location-point text-base" />
                {bed.location_object?.name}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="relative flex flex-col gap-2 divide-x-0 divide-y divide-blue-600 md:flex-row md:justify-between md:divide-x md:divide-y-0">
        <div>
          <div
            className={classNames(
              "flex flex-col items-center justify-center gap-1 p-1 text-center font-mono font-medium text-warning-500",
              isOnline && "hidden"
            )}
            style={{ ...(size ?? waveformCanvas.size) }}
          >
            <CareIcon className="care-l-cloud-times mb-2 animate-pulse text-4xl" />
            <span className="font-bold">No incoming data from Ventilator</span>
          </div>
          <div
            className={classNames("relative", !isOnline && "hidden")}
            style={{ ...(size ?? waveformCanvas.size) }}
          >
            <WaveformLabels
              labels={{
                Pressure: "text-lime-300",
                Flow: "text-yellow-300",
                Volume: "text-sky-300",
              }}
            />
            <canvas
              className="absolute left-0 top-0"
              ref={waveformCanvas.background.canvasRef}
              style={{ ...(size ?? waveformCanvas.size) }}
              {...waveformCanvas.size}
            />
            <canvas
              className="absolute left-0 top-0"
              ref={waveformCanvas.foreground.canvasRef}
              style={{ ...(size ?? waveformCanvas.size) }}
              {...waveformCanvas.size}
            />
          </div>
        </div>
        <div className="z-10 grid grid-cols-3 divide-blue-600 bg-[#020617] tracking-wider text-white md:absolute md:inset-y-0 md:right-0 md:grid-cols-1 md:divide-y">
          <NonWaveformData
            label="PEEP"
            attr={data.peep}
            className="text-orange-500"
          />
          <NonWaveformData
            label="R. Rate"
            attr={data.respRate}
            className="text-sky-300"
          />
          <NonWaveformData
            label="Insp-Time"
            attr={data.inspTime}
            className="text-fuchsia-400"
          />
          <NonWaveformData
            label="FiO2"
            attr={data.fio2}
            className="text-yellow-300"
          />
        </div>
      </div>
    </div>
  );
}

interface NonWaveformDataProps {
  label: string;
  attr?: VitalsValueBase;
  className?: string;
}

const NonWaveformData = ({ label, attr, className }: NonWaveformDataProps) => {
  return (
    <div
      className={classNames("flex items-center justify-between p-1", className)}
    >
      <div className="flex h-full flex-col items-start gap-1 font-bold">
        <span className="text-sm">{label}</span>
        <span className="text-xs">{attr?.unit ?? "--"}</span>
      </div>
      <span className="mr-3 text-4xl font-black md:text-6xl">
        {attr?.value ?? "--"}
      </span>
    </div>
  );
};
