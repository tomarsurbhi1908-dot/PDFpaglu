'use client';

import { useMemo, useRef, useState } from 'react';
import type { ToolConfig } from '@/lib/tools';
import { prettyBytes } from '@/lib/utils';

type Result = {
  ok: boolean;
  filename?: string;
  downloadUrl?: string;
  message?: string;
  error?: string;
};

export default function ToolClient({ tool }: { tool: ToolConfig }) {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState('1');
  const [quality, setQuality] = useState('ebook');
  const [text, setText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'ready' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const signatureRef = useRef<HTMLInputElement | null>(null);

  const canConvert = useMemo(() => {
    let valid = false;
    if (tool.multiple) valid = files.length > 0 && (tool.slug !== 'merge-pdf' || files.length > 1);
    else valid = files.length === 1;

    if (tool.needsSignature && !signatureFile) valid = false;
    return valid;
  }, [files, tool.multiple, tool.slug, tool.needsSignature, signatureFile]);

  function onFiles(nextFiles: FileList | null) {
    if (!nextFiles) return;
    setFiles((current) => {
      const incoming = Array.from(nextFiles);
      return tool.multiple ? [...current, ...incoming] : incoming.slice(0, 1);
    });
    setResult(null);
    setStatus('idle');
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((current) => {
      const copy = [...current];
      const target = index + direction;
      if (target < 0 || target >= copy.length) return current;
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function convert() {
    if (!canConvert) return;
    setStatus('uploading');
    setResult(null);

    const form = new FormData();
    if (tool.multiple) {
      files.forEach((file) => form.append('files', file));
    } else {
      form.append('file', files[0]);
    }
    if (tool.needsRanges) form.append('ranges', ranges);
    if (tool.needsQuality) form.append('quality', quality);
    if (tool.needsText) form.append('text', text);
    if (tool.needsPassword) form.append('password', password);
    if (tool.needsSignature && signatureFile) form.append('signature', signatureFile);

    try {
      const response = await fetch(tool.endpoint, {
        method: 'POST',
        body: form
      });
      const data = (await response.json()) as Result;
      setResult(data);
      setStatus(data.ok ? 'ready' : 'error');
    } catch {
      setResult({ ok: false, error: 'Something went wrong. Please try again.' });
      setStatus('error');
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFiles(event.dataTransfer.files);
        }}
        className="rounded-[1.5rem] border border-dashed border-indigo-200 bg-slate-50 p-8 text-center transition hover:border-indigo-300"
      >
        <input
          ref={inputRef}
          type="file"
          accept={tool.accept}
          multiple={tool.multiple}
          className="hidden"
          onChange={(event) => onFiles(event.target.files)}
        />
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-600 text-2xl font-black text-white shadow-md">↑</div>
        <h2 className="text-2xl font-black text-slate-900">Drop files here</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">{tool.helpText}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Choose files
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Selected files</h3>
            <button type="button" className="text-sm text-slate-500 hover:text-slate-900" onClick={() => setFiles([])}>
              Clear all
            </button>
          </div>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{index + 1}. {file.name}</p>
                  <p className="text-sm text-slate-500">{prettyBytes(file.size)}</p>
                </div>
                <div className="flex gap-2">
                  {tool.slug === 'merge-pdf' && (
                    <>
                      <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => moveFile(index, -1)}>Up</button>
                      <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => moveFile(index, 1)}>Down</button>
                    </>
                  )}
                  <button
                    type="button"
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(tool.needsRanges || tool.needsQuality || tool.needsText || tool.needsPassword || tool.needsSignature) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {tool.needsRanges && (
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-bold text-slate-700">Pages to extract</span>
              <input
                value={ranges}
                onChange={(event) => setRanges(event.target.value)}
                placeholder="1-3,5"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-400"
              />
            </label>
          )}
          {tool.needsQuality && (
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-bold text-slate-700">Compression quality</span>
              <select
                value={quality}
                onChange={(event) => setQuality(event.target.value)}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-400"
              >
                <option value="screen">Smallest file</option>
                <option value="ebook">Balanced</option>
                <option value="printer">High quality</option>
                <option value="prepress">Best quality</option>
              </select>
            </label>
          )}
          {tool.needsText && (
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-bold text-slate-700">Watermark text</span>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="CONFIDENTIAL"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-400"
              />
            </label>
          )}
          {tool.needsPassword && (
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-bold text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter strong password"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-400"
              />
            </label>
          )}
          {tool.needsSignature && (
            <div className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm font-bold text-slate-700">Signature Image</span>
              <input
                ref={signatureRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setSignatureFile(file);
                }}
              />
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-sm text-slate-600 truncate mr-2">
                  {signatureFile ? signatureFile.name : 'No signature uploaded'}
                </span>
                <button
                  type="button"
                  onClick={() => signatureRef.current?.click()}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                >
                  {signatureFile ? 'Change' : 'Upload'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Output: <span className="font-semibold text-slate-700">{tool.output}</span>
          {tool.experimental && <span className="ml-2 font-medium text-amber-600">Experimental conversion</span>}
        </div>
        <button
          type="button"
          disabled={!canConvert || status === 'uploading'}
          onClick={convert}
          className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-7 py-3 font-black text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'uploading' ? 'Converting...' : `Convert ${tool.shortTitle}`}
        </button>
      </div>

      {result && (
        <div className={`mt-6 rounded-2xl border p-4 ${result.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          <p className="font-bold">{result.ok ? result.message : result.error}</p>
          {result.ok && result.downloadUrl && (
            <a
              href={result.downloadUrl}
              className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-black text-white shadow-md transition hover:bg-slate-800"
            >
              Download {result.filename || 'file'}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
