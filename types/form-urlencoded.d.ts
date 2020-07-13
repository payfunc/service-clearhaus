declare namespace formUrlEncoded {
	interface FormEncodedOptions {
			sorted?: boolean;
			skipIndex?: boolean;
			ignorenull?: boolean;
	}
}

declare function formUrlEncoded(data: any, opts?: formUrlEncoded.FormEncodedOptions): string;
export default formUrlEncoded;
